"use client";

import { Howl } from "howler";
import { useEffect, useRef } from "react";

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
    };
    if (soundHowl.current != null) {
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
      } else {
        console.log("somehting wetn wrong on init");
      }
    }
    return () => {
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
    } else {
      soundHowl.current?.pause();
    }
  }, [props.isPlaying]);
  return <></>;
};

export default SpatialSound;
