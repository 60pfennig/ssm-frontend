import { SoundServiceInstance } from "@/services/SoundsService";
import { Sound } from "@/types/domain/types";
import { useState, useEffect } from "react";

export const useSounds: (params: { workshop?: string }) => {
  sounds: Sound[];
} = (params) => {
  const [sounds, setSounds] = useState<Sound[]>([]);

  useEffect(() => {
    const fetchSounds = async () => {
      const soundsResult = params.workshop
        ? await SoundServiceInstance.getSoundsOfWorkshop(params.workshop)
        : await SoundServiceInstance.getAllSounds();
      if (soundsResult.ok) {
        setSounds(soundsResult.val);
      }
    };
    fetchSounds();
  }, [params.workshop]);

  return { sounds };
};
