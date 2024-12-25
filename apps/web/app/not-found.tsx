"use client";

import { ErrorMessage } from "@repo/ui/web";
import React from "react";

const Custom404: React.FC = () => {
  return <ErrorMessage code={404} />;
};

export default Custom404;
