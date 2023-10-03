import React from "react";
import { useRef, useEffect } from "react";
import { Sound } from "@/types/domain/types";
import { LatLng } from "leaflet";
import { useMemo } from "react";
import { Howl } from "howler";

type Props = {
  pos: { x: number; y: number };
  audioFileUri: string;
  isPlaying: boolean;
};

const SpatialSound = (props: Props) => {
  const soundHowl = useRef<null | Howl>();

  useEffect(() => {
    console.log("creating spatial sound", props);
    if (soundHowl.current != null) {
      console.log("already exists, changing pos");

      soundHowl.current?.pos(props.pos.x, props.pos.y, 0);
      return;
    }
    const isOutsideOfHearingRange = false;

    const cleanup = () => soundHowl.current?.unload();
    cleanup();

    if (!isOutsideOfHearingRange) {
      soundHowl.current = new Howl({ src: props.audioFileUri, loop: true });
      soundHowl.current?.pos(props.pos.x, props.pos.y, 0);
      if (props.isPlaying) {
        soundHowl.current.play();
        console.log("its playing");
      }
      console.log("its loaded");
    } else {
      console.log("somehting wetn wrong on init");
    }
    return () => {
      cleanup();
    };
  }, [props.audioFileUri, props.pos, props.isPlaying]);

  useEffect(() => {
    if (props.isPlaying) {
      soundHowl.current?.play();
      console.log("its playing");
    } else {
      soundHowl.current?.pause();
      console.log("its paused");
    }
  }, [props.isPlaying]);

  return <div>SpatialSound</div>;
};

export default SpatialSound;
