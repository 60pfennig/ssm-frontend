import { Sound, SoundMedia } from "@/types/domain/types";

export function isSoundMedia(
  object: string | SoundMedia
): object is SoundMedia {
  return typeof object !== "string";
}
