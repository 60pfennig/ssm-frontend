"use client";

import { ChakraProvider } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type Props = { children: ReactNode | ReactNode[] };

const Providers = (props: Props) => {
  return <ChakraProvider>{props.children}</ChakraProvider>;
};

export default Providers;
