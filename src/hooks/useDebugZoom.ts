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
    console.log("zoom change", newZoom, prevZoomLevel);

    const newAbsLeftCOrnerLatLng = map.unproject(new Point(0, 0));
    const newAbsLeftPoint = Projection.LonLat.project(newAbsLeftCOrnerLatLng);
    if (prevZoomLevel !== -1) {
      console.log("x-zoom scale", prevLeftCorner.x, newAbsLeftPoint.x);
      console.log(prevLeftCorner.x / newAbsLeftPoint.x);
      console.log("y-zoom scale");
      console.log(prevLeftCorner.y / newAbsLeftPoint.y);
    }
    setPrevCorner(newAbsLeftPoint);
    setPrevZoomLevel(newZoom);
  };

  return { onZoomChange };
};
