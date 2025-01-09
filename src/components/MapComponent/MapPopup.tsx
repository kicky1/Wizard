import { X } from "lucide-react";
import Map from "ol/Map";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { PopupData } from "@/types/map";
  
interface Props {
    popupData: PopupData | null;
    onClose: () => void;
    map: Map | null;
  }

export const MapPopup = ({
    popupData,
    onClose,
    map,
  }: Props) => {
    if (!popupData || !map) return null;
  
    const pixelPosition = map.getPixelFromCoordinate(popupData.position);
  
    return (
      <div
        className="absolute z-10 transform -translate-x-1/2 -translate-y-full"
        style={{
          left: pixelPosition?.[0],
          top: pixelPosition?.[1],
        }}
      >
        <Card className="max-w-sm shadow-lg">
          <CardContent className="text-sm p-0">
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <div />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 mt-1 mr-1 hover:bg-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col items-center px-6 pt-1 pb-4">
                <div>{popupData.content}</div>
              </div>
              <div className="absolute w-4 h-4 bg-white rotate-45 left-1/2 -bottom-2 -ml-2 border-r border-b border-gray-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };