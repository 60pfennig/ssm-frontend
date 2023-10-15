"use client";

import { useSounds } from "@/hooks/useSounds";
import { Box } from "@chakra-ui/react";
import L, { LatLng, LeafletEvent, Point } from "leaflet";
import React, { ReactNode } from "react";
import { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import SpatialSound from "../molecules/SpatialSound";
import { Sound } from "@/types/domain/types";
import { LEAFLET_ICON } from "@/constants/LeafletIcon";
import { isSoundMedia } from "@/lib/type-guards/isSoundMedia";
import { useDebugZoom } from "@/hooks/useDebugZoom";
import HearRangeIndicator from "../atoms/HearRangeIndicator";
import useMousePosition from "@/hooks/useMousePosition";

type Props = {};

const MAP_TO_LOCAL_SCALING_FACTOR = 0.25;

/**
 * See https://leaflet-extras.github.io/leaflet-providers/preview/ for tile layerss
 */
function SoundMap({}: Props) {
  const [isPlaying, setIsPlaysing] = useState(false);
  const [currentMouseOnMap, setCurrentMauseOnMap] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const { sounds } = useSounds({});
  const mapRef = useRef<L.Map | null>(null);
  const position = { lat: 51.234517, lng: 14.748265 };
  const [currentHearRange, setCurrentHearRange] = useState(50);
  const [currentHearRangeInMapWidth, setcurrentHearRangeInMapWidth] =
    useState(100);
  const mousePosition = useMousePosition();

  const projectMouseRangeToMapRange = () => {
    // if (!mapRef.current) return;
    // const newRangePointInLayer = mapRef.current.containerPointToLayerPoint(
    //   new Point(currentHearRange, currentHearRange)
    // );
    // console.log(newRangePointInLayer);
    // return;
    // const containerPosMouse = new Point(
    //   currentMouseOnMap.x,
    //   currentMouseOnMap.y
    // );
    // console.log(
    //   "mouse container ",
    //   containerPosMouse?.subtract(mapRef.current.getPixelOrigin()),
    //   currentMouseOnMap,
    //   mapRef.current.getPixelOrigin()
    // );
    // const aPointInHearingRange: Point | undefined = containerPosMouse
    //   ?.clone()
    //   .add(new Point(currentHearRange, currentHearRange));
    // console.log(
    //   "point in hearing range container ",
    //   aPointInHearingRange,
    //   containerPosMouse
    // );
    // if (aPointInHearingRange && mapRef.current) {
    //   const newProjecedRangePoint = mapRef.current
    //     .containerPointToLayerPoint(aPointInHearingRange)
    //     .clone()
    //     .subtract(new Point(currentMouseOnMap.x, currentMouseOnMap.y));
    //   console.log(
    //     "point in hearing range layer substracted ",
    //     newProjecedRangePoint
    //   );
    //   setcurrentHearRangeInMapWidth(newProjecedRangePoint.x);
    // }
  };

  const onMouseMove = useCallback((mouseEvent: L.LeafletMouseEvent) => {
    // console.log("mouspos update");
    // console.log(mapRef.current?.project(mouseEvent.latlng));
    // console.log(L.Projection.LonLat.project(mouseEvent.latlng));
    setCurrentMauseOnMap(
      mapRef.current?.project(mouseEvent.latlng) || { x: 0, y: 0 }
    );
  }, []);

  const onZoom = (event: LeafletEvent) => {
    projectMouseRangeToMapRange();
  };

  const togglePlayer = useCallback(() => {
    if (isPlaying) setIsPlaysing(false);
    else {
      setIsPlaysing(true);
    }
  }, [isPlaying, setIsPlaysing]);

  useEffect(() => {
    //console.log("ready", mapRef.current);
    mapRef.current?.addEventListener("mousemove", onMouseMove);
    mapRef.current?.addEventListener("zoomend", onZoom);
    mapRef.current?.addEventListener("click", () => togglePlayer());
  }, [mapRef.current, onMouseMove]);

  useEffect(() => {
    Howler.volume(1);
    Howler.orientation(0, 1, 0, 0, 0, 1);
  }, []);

  return (
    <Box width={"100vw"} height={"100vh"} position={"relative"}>
      <MapContainer
        style={{ height: "100vh", position: "relative" }}
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        <LayerGroup>
          <HearRangeIndicator pos={mousePosition} range={currentHearRange} />
        </LayerGroup>
        {sounds.map((sound, index) => (
          <Marker
            key={"soundmarker" + index}
            position={[sound.lat, sound.lng]}
            icon={LEAFLET_ICON}
          >
            <Popup>{sound.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {sounds.reduce<ReactNode[]>((prev, sound, index) => {
        if (isSoundMedia(sound.audioFile) && sound.audioFile.url) {
          return [
            ...prev,
            <SpatialSound
              hearingDistance={currentHearRange}
              audioFileUri={sound.audioFile.url}
              key={"spatialsound" + sound.id}
              pos={
                mapRef.current?.project(new LatLng(sound.lat, sound.lng)) || {
                  x: 0,
                  y: 0,
                }
              }
              earPos={currentMouseOnMap}
              isPlaying={isPlaying}
            />,
          ];
        }
        return prev;
      }, [])}
    </Box>
  );
}

export default SoundMap;
