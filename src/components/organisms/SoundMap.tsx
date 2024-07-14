"use client";

import { LEAFLET_ICON } from "@/constants/LeafletIcon";
import useMousePosition from "@/hooks/useMousePosition";
import { useSounds } from "@/hooks/useSounds";
import { isSoundMedia } from "@/lib/type-guards/isSoundMedia";
import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import L, { LatLng, LeafletEvent, LeafletKeyboardEvent } from "leaflet";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MdAudiotrack } from "react-icons/md";
import { LayerGroup, Marker, Pane, Popup } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import HearRangeIndicator from "../atoms/HearRangeIndicator";
import SpatialSound from "../molecules/SpatialSound";
import StartScreen from "../molecules/StartScreen";

type Props = {};

const MAP_TO_LOCAL_SCALING_FACTOR = 0.25;

const MAX_ZOOM = 12;

const INIT_MAX_DISTANCE = 500;
const INIT_ROLLOFF = 0.1;

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
  const [scrollOnMouseWheel, setScrollOnMouseWheel] = useState(false);
  const [isCtrlDown, setIsCtrlDown] = useState(false);
  const [scrollDelta, setScrollDelta] = useState(0);
  const [currentRefDistance, setCurrentRefDistance] = useState(1);
  const [currentMaxDistance, setCurrentMaxDistance] = useState(INIT_MAX_DISTANCE);
  const [currentRolloffFactor, setCurrentRolloffFactor] = useState(INIT_ROLLOFF);
  const [maxHearingRange, setMaxHearingRange] = useState(1);
  const [currentHearRangeInMapWidth, setcurrentHearRangeInMapWidth] = useState(100);
  const mousePosition = useMousePosition();
  /**  This can scale the rollofffacot on zoom so it would stay the same ABSOLUTE radius instead of staying
   *  the same pixel size and therefor getting "bigger" or "smaller" in the sound/map space beacuse of the zoom
   * */
  const projectMouseRangeToMapRange = () => {
    const currentZoom = mapRef.current?.getZoom();
    const map = mapRef.current;
    if (!currentZoom || !map) return;
    const scaleFactor = Math.pow(2, MAX_ZOOM - currentZoom);
    const newRollofFactor = scaleFactor * currentRolloffFactor;

    // setCurrentRolloffFactor(newRollofFactor);
  };

  const onMouseMove = useCallback((mouseEvent: L.LeafletMouseEvent) => {
    const bounds = mapRef.current?.getPixelBounds();
    const mapWIdth = (bounds?.getBottomRight().x || 0) - (bounds?.getBottomLeft().x || 0);
    const mapheight = (bounds?.getBottomLeft().y || 0) - (bounds?.getTopLeft().y || 0);

    setCurrentMauseOnMap(mapRef.current?.project(mouseEvent.latlng) || { x: 0, y: 0 });
  }, []);

  const onZoom = (event: LeafletEvent) => {
    projectMouseRangeToMapRange();
  };

  const handleCtrlDown = (event: LeafletKeyboardEvent) => {
    if (event.originalEvent.ctrlKey === true) {
      setIsCtrlDown(true);
      mapRef.current?.scrollWheelZoom.enable();
      setScrollOnMouseWheel(true);
    }
    event.originalEvent.preventDefault();
  };

  const handleKeyUp = (event: LeafletKeyboardEvent) => {
    setIsCtrlDown(false);
    mapRef.current?.scrollWheelZoom.disable();
    setScrollOnMouseWheel(true);
  };

  const handleMouseWheel = (leafletEvent: WheelEvent) => {
    if (!isCtrlDown)
      setScrollDelta((delta) => {
        const newDelta = delta + leafletEvent.deltaY;
        const newFactor = -0.001 * newDelta;

        if (newFactor > 0.001 && newFactor <= 6) {
          setCurrentRolloffFactor(newFactor);
          return newDelta;
        }
        return delta;
      });
  };

  useEffect(() => {}, [scrollDelta]);

  useEffect(() => {
    //console.log("ready", mapRef.current);
    mapRef.current?.addEventListener("mousemove", onMouseMove);
    mapRef.current?.addEventListener("zoom", onZoom);
    mapRef.current?.on("keydown", handleCtrlDown);
    mapRef.current?.on("keyup", handleKeyUp);
    window.addEventListener("wheel", handleMouseWheel);

    return () => {
      window.removeEventListener("wheel", handleMouseWheel);
    };
  }, [mapRef.current]);

  useEffect(() => {}, [currentRolloffFactor, currentRefDistance]);

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
        scrollWheelZoom={scrollOnMouseWheel}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
        />
        <Pane name="Sound">
          <LayerGroup>{!isPlaying && <StartScreen onClick={() => setIsPlaysing(true)} />}</LayerGroup>
        </Pane>

        {isPlaying && (
          <HearRangeIndicator
            pos={mousePosition}
            refDistance={currentRefDistance}
            rolloffFactor={currentRolloffFactor}
          />
        )}

        {isPlaying &&
          sounds.map((sound, index) => (
            <Marker key={"soundmarker" + index} position={[sound.lat, sound.lng]} icon={LEAFLET_ICON}>
              <Popup maxWidth={2000}>
                <VStack>
                  <Flex direction={"row"} align={"center"} gap={2} alignSelf={"start"}>
                    <MdAudiotrack />

                    <Text display={"inline"} margin={0} fontSize={"large"}>
                      {sound.name}
                    </Text>
                  </Flex>
                  {typeof sound.image === "object" && sound.image.url !== undefined ? (
                    <Box w={500}>
                      <Image alt="image for sound" src={sound.image.url} w={"100%"} />
                    </Box>
                  ) : null}
                </VStack>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      {sounds.reduce<ReactNode[]>((prev, sound, index) => {
        if (isSoundMedia(sound.audioFile) && sound.audioFile.url) {
          return [
            ...prev,
            <SpatialSound
              rolloffFactor={currentRolloffFactor}
              refDistance={currentRefDistance}
              maxDistance={currentMaxDistance}
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
