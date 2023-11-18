import { Point } from "@/types/domain/Points";
import { Box } from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";

type Props = {
  pos: Point;
  rolloffFactor: number;
  refDistance: number;
};

const hearingThreshold = 1e-12;

const HearRangeIndicator = (props: Props) => {
  useEffect(() => {
    console.log(
      "radius",
      props.refDistance *
        Math.pow(1 / hearingThreshold, 1 / props.rolloffFactor)
    );
  }, [props]);

  const hearingRange = useMemo(
    () => props.refDistance / 0.01 / props.rolloffFactor - props.refDistance,
    // () =>
    //   props.refDistance *
    //   Math.pow(100 / hearingThreshold, 1 / props.rolloffFactor),
    [props.refDistance, props.rolloffFactor]
  );

  return (
    <Box
      //transform={`translate(-${props.range / 2}, -${props.range / 2}`}

      position={"absolute"}
      left={props.pos.x - hearingRange}
      top={props.pos.y - hearingRange}
      border={"1px solid black"}
      borderRadius={"full"}
      width={hearingRange * 2}
      height={hearingRange * 2}
      zIndex={5000}
      cursor={"none"}
      pointerEvents={"none"}
    ></Box>
  );
};

export default HearRangeIndicator;
