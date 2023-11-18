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
  maxDistance: number;
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
          volume: 1,
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
          rolloffFactor: props.rolloffFactor,
          distanceModel: "inverse",
          refDistance: props.refDistance,
          // maxDistance: props.maxDistance,
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
    console.log(
      "marker position",
      props.pos.x - props.earPos.x,
      props.pos.y - props.earPos.y
    );
    soundHowl.current?.pos(
      props.pos.x - props.earPos.x,
      props.pos.y - props.earPos.y,
      0
    );
  }, [props.pos, props.earPos]);

  useEffect(() => {
    soundHowl.current?.pannerAttr({
      ...soundHowl.current.pannerAttr,
      coneInnerAngle: 360,
      coneOuterAngle: 0,
      coneOuterGain: 0,
      maxDistance: props.maxDistance,
      refDistance: props.refDistance,
      rolloffFactor: props.rolloffFactor,
      distanceModel: "inverse",
    });
    soundHowl.current?.pos(
      props.pos.x - props.earPos.x,
      props.pos.y - props.earPos.y,
      0
    );
    // soundHowl.current?.play();
  }, [props.refDistance, props.rolloffFactor, props.maxDistance]);

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
