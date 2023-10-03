import Image from "next/image";
import styles from "./page.module.css";
import SoundMap from "@/components/organisms/SoundMap";
import dynamic from "next/dynamic";

export const DynamicTestMap = dynamic(
  () => import("@/components/organisms/SoundMap"),
  {
    ssr: false,
  }
);

export default function Home() {
  return <SoundMap />;
}
