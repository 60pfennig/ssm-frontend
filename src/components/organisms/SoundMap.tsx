"use client";

import { useSounds } from "@/hooks/useSounds";
import React from "react";

type Props = {};

function SoundMap({}: Props) {
  const { sounds } = useSounds({});
  return (
    <div>
      <ul>
        {sounds.map((sound) => (
          <li key={sound.name + "li"}>{sound.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SoundMap;
