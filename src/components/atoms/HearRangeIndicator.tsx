import { Point } from "@/types/domain/Points";
import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";

type Props = {
  range: number;
  pos: Point;
};

const HearRangeIndicator = (props: Props) => {
  useEffect(() => {
    //console.log(props);
  }, [props]);
  return (
    <Box
      //transform={`translate(-${props.range / 2}, -${props.range / 2}`}

      position={"absolute"}
      left={props.pos.x - props.range / 2}
      top={props.pos.y - props.range / 2}
      border={"1px solid black"}
      borderRadius={"full"}
      width={props.range}
      height={props.range}
      zIndex={5000}
      cursor={"none"}
    ></Box>
  );
};

export default HearRangeIndicator;
