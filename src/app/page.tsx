import SoundMap from "@/components/organisms/SoundMap";
import dynamic from "next/dynamic";

const DynamicSoundMap = dynamic(
  () => import("../components/organisms/SoundMap"),
  {
    ssr: false,
  }
);

export default function Home() {
  return <DynamicSoundMap />;
}
