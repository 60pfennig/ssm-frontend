"use client";

import { useSounds } from "@/hooks/useSounds";
import { Box } from "@chakra-ui/react";
import L, { LatLng } from "leaflet";
import React, { ReactNode } from "react";
import { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import SpatialSound from "../molecules/SpatialSound";
import { isSoundMedia } from "@/lib/type-guards/isSoundMEdia";
import { Sound } from "@/types/domain/types";
import { LEAFLET_ICON } from "@/constants/LeafletIcon";

type Props = {};

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

  const testHowl = useRef(
    new Howl({
      src: "http://localhost:3000/media/audio/epic-hybrid-logo-157092.mp3",
    })
  );
  const onMouseMove = useCallback((mouseEvent: L.LeafletMouseEvent) => {
    //console.log("mouspos update");
    setCurrentMauseOnMap(L.Projection.LonLat.project(mouseEvent.latlng));
  }, []);

  const togglePlayer = useCallback(() => {
    if (isPlaying) setIsPlaysing(false);
    else {
      setIsPlaysing(true);
    }
  }, [isPlaying, setIsPlaysing]);

  useEffect(() => {
    //console.log("ready", mapRef.current);
    mapRef.current?.addEventListener("mousemove", onMouseMove);
    mapRef.current?.addEventListener("click", () => togglePlayer());
  }, [mapRef.current, onMouseMove]);

  useEffect(() => {
    Howler.volume(1);
    Howler.orientation(0, 1, 0, 0, 0, 1);
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
          //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
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
              audioFileUri={sound.audioFile.url}
              key={"spatialsound" + sound.id}
              pos={L.Projection.LonLat.project(
                new LatLng(sound.lat, sound.lng)
              )}
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
