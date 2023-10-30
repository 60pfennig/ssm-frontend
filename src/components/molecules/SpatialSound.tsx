import React from "react";
import { useRef, useEffect } from "react";
import { Sound } from "@/types/domain/types";
import { LatLng } from "leaflet";
import { useMemo } from "react";
import { Howl } from "howler";

type Props = {
  pos: { x: number; y: number };
  earPos: { x: number; y: number };
  audioFileUri: string;
  isPlaying: boolean;
  refDistance: number;
  rolloffFactor: number;
};

const SpatialSound = (props: Props) => {
  const soundHowl = useRef<null | Howl>();

  useEffect(() => {
    const cleanup = () => {
      soundHowl.current?.unload();
      soundHowl.current = null;
      console.log("unloding");
    };
    console.log("creating spatial sound", props);
    if (soundHowl.current != null) {
      console.log("already exists");
    } else {
      const isOutsideOfHearingRange = false;

      if (!isOutsideOfHearingRange) {
        cleanup();
        soundHowl.current = new Howl({
          src: [props.audioFileUri],
          loop: true,
          onloaderror: (error) => {
            console.log("error", error);
          },
          onplayerror: (error) => {
            console.log("error", error);
          },
          onplay: (param) => {
            console.log("file " + param);
          },
        });
        soundHowl.current.pannerAttr({
          rolloffFactor: 4,
          distanceModel: "inverse",
          refDistance: 100,
        });
        console.log("its loaded");
      } else {
        console.log("somehting wetn wrong on init");
      }
    }
    return () => {
      console.log("unmounting");
      cleanup();
    };
  }, [props.audioFileUri]);

  useEffect(() => {
    soundHowl.current?.pos(
      props.pos.x - props.earPos.x,
      props.pos.y - props.earPos.y,
      0
    );
  }, [props.pos, props.earPos]);

  useEffect(() => {
    soundHowl.current?.pannerAttr({
      refDistance: props.refDistance,
      rolloffFactor: props.rolloffFactor,
    });
  }, [props.refDistance, props.rolloffFactor]);

  useEffect(() => {
    if (props.isPlaying) {
      //soundHowl.current?.seek(0);
      soundHowl.current?.play();
      // soundHowl.current?.volume(1);
      console.log("its playing", soundHowl.current);
    } else {
      soundHowl.current?.pause();
      console.log("its paused");
    }
  }, [props.isPlaying]);

  return <div>SpatialSound</div>;
};

export default SpatialSound;
