"use client";

import { useSounds } from "@/hooks/useSounds";
import { Box } from "@chakra-ui/react";
import L from "leaflet";
import React, { ReactNode } from "react";
import { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import SpatialSound from "../molecules/SpatialSound";
import { isSoundMedia } from "@/lib/type-guards/isSoundMEdia";
import { Sound } from "@/types/domain/types";

type Props = {};

function SoundMap({}: Props) {
  const [isPlaying, setIsPlaysing] = useState(false);
  const { sounds } = useSounds({});
  const mapRef = useRef<L.Map | null>(null);
  const position = { lat: 51.234517, lng: 14.748265 };
  const onMouseMove = useCallback((mouseEvent: L.LeafletMouseEvent) => {
    //console.log("mouspos update");
    Howler.pos(mouseEvent.latlng.lat, mouseEvent.latlng.lng, 0);
  }, []);

  const togglePlayer = useCallback(() => {
    if (isPlaying) setIsPlaysing(false);
    else setIsPlaysing(true);
  }, [isPlaying, setIsPlaysing]);

  useEffect(() => {
    //console.log("ready", mapRef.current);
    mapRef.current?.addEventListener("mousemove", onMouseMove);
    mapRef.current?.addEventListener("click", () => togglePlayer());
  }, [mapRef.current, onMouseMove]);

  useEffect(() => {
    Howler.volume(1);
  }, []);

  return (
    <Box width={"100vw"} height={"100vh"}>
      <MapContainer
        style={{ height: "100vh" }}
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sounds.map((sound, index) => (
          <Marker
            key={"soundmarker" + index}
            position={position}
            icon={L.icon({
              iconUrl: "vercel.svg",
            })}
          >
            <Popup>{sound.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {isPlaying &&
        sounds.reduce<ReactNode[]>((prev, sound) => {
          if (isSoundMedia(sound.audioFile) && sound.audioFile.url) {
            return [
              ...prev,
              <SpatialSound
                audioFileUri={sound.audioFile.url}
                key={"spatialsound" + sound.id}
                pos={{ x: sound.lat, y: sound.lng }}
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
