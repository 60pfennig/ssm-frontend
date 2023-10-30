import { Point } from "@/types/domain/Points";
import { Box } from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";

type Props = {
  pos: Point;
  rolloffFactor: number;
  refDistance: number;
};

const HearRangeIndicator = (props: Props) => {
  useEffect(() => {
    //console.log(props);
  }, [props]);

  const hearingRange = useMemo(
    () => props.refDistance / 0.1 / props.rolloffFactor - props.refDistance,
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
