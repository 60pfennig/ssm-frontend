import { LatLng, Map, Point, Projection } from "leaflet";
import { useState, useEffect, Ref, MutableRefObject, useCallback } from "react";

type Props = {
  //leftCornerALatLong: LatLng,
};

export const useDebugZoom = () => {
  const [prevLeftCorner, setPrevCorner] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [prevZoomLevel, setPrevZoomLevel] = useState(-1);

  const onZoomChange = (newZoom: number, map: Map) => {
    const newAbsLeftCOrnerLatLng = map.unproject(new Point(0, 0));
    const newAbsLeftPoint = Projection.LonLat.project(newAbsLeftCOrnerLatLng);
    if (prevZoomLevel !== -1) {
    }
    setPrevCorner(newAbsLeftPoint);
    setPrevZoomLevel(newZoom);
  };

  return { onZoomChange };
};
