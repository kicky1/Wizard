export type PopupData = {
    content: string;
    position: number[];
}

export type GeoJSON = {
    type: string;
    geometry: {
      coordinates: number[];
    };
    properties: {
      description: string;
    };
  }