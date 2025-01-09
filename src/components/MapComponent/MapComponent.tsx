import { useEffect, useRef, useState, useCallback } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { defaults as defaultControls } from 'ol/control';
import { Card, CardContent } from "@/components/ui/card";
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { PopupData } from '@/types/map';
import { MapPopup } from './MapPopup';

interface Props {
  file: File | string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export const MapComponent = ({
  file,
  fillColor = 'rgba(76, 175, 80, 0.3)',
  strokeColor = '#2E7D32',
  strokeWidth = 2,
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [popupData, setPopupData] = useState<PopupData | null>(null);

  const createStyle = useCallback(
    (isHover = false) =>
      new Style({
        fill: new Fill({
          color: isHover ? 'rgba(76, 175, 80, 0.5)' : fillColor,
        }),
        stroke: new Stroke({
          color: isHover ? '#1B5E20' : strokeColor,
          width: isHover ? 3 : strokeWidth,
        }),
      }),
    [fillColor, strokeColor, strokeWidth]
  );
  
  useEffect(() => {
    if (!mapRef.current) return;

    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [baseLayer],
      view: new View({
        projection: 'EPSG:3857',
        center: fromLonLat([0, 0]),
        zoom: 10,
      }),
      controls: defaultControls({
        attribution: false,
        zoom: false,
        rotate: false,
      })
    });

    const mapTarget = initialMap.getTargetElement();
    if (mapTarget) {
      mapTarget.style.position = 'relative';
      mapTarget.style.borderRadius = '0 0 10px 10px';
      mapTarget.style.overflow = 'hidden';
    }

    setMap(initialMap);

    return () => initialMap.setTarget(undefined);
  }, []);
  
  useEffect(() => {
    if (!map || !file) return;

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: createStyle(false),
    });

    const loadGeoJSON = async () => {
      try {
        const geoJSONData =
          typeof file === 'string'
            ? file
            : await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = () => reject(new Error('File read error'));
                reader.readAsText(file);
              });

        const features = new GeoJSON().readFeatures(geoJSONData, {
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:4326',
        });

        vectorSource.addFeatures(features);
        map.getView().fit(vectorSource.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 12,
          duration: 1000,
        });
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };

    map.addLayer(vectorLayer);
    loadGeoJSON();

    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [map, file, createStyle]);

  useEffect(() => {
    if (!map) return;

    let hoveredFeature: Feature<Geometry> | null = null;

    const handlePointerMove = (e: { originalEvent: UIEvent | { clientX: number; clientY: number; }; }) => {
      const features = map.getFeaturesAtPixel(
        map.getEventPixel(e.originalEvent)
      );

      if (hoveredFeature && features.indexOf(hoveredFeature) === -1) {
          hoveredFeature.setStyle(createStyle(false));
      }

      if (features.length > 0) {
          const feature = features[0] as Feature<Geometry>;
          feature.setStyle(createStyle(true));
          hoveredFeature = feature;
          mapRef.current!.style.cursor = 'pointer';
      } else {
          hoveredFeature = null;
          mapRef.current!.style.cursor = '';
      }
    };

    const handleClick = (e: { originalEvent: UIEvent | { clientX: number; clientY: number; }; }) => {
      const feature = map.forEachFeatureAtPixel(
        map.getEventPixel(e.originalEvent),
        (feature) => feature
      );

      const properties = feature?.getProperties();

      if (properties?.description) {
        setPopupData({
          content: properties.description,
          position: map.getCoordinateFromPixel(map.getEventPixel(e.originalEvent)),
        });
      } else {
        setPopupData(null);
      }
    };

    map.on('pointermove', handlePointerMove);
    map.on('click', handleClick);

    return () => {
      map.un('pointermove', handlePointerMove);
      map.un('click', handleClick);
    };
  }, [map, createStyle]);

  return (
    <Card className="relative rounded-t-none">
      <CardContent className="p-0">
        <div ref={mapRef} className="w-full h-96" />
        <MapPopup popupData={popupData} onClose={() => setPopupData(null)} map={map} />
      </CardContent>
    </Card>
  );
};