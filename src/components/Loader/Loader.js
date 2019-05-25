import React from "react";
import { ActivityIndicator } from "react-native";

import THEME from "@theme";

const Loader = ({ ...props }) => (
  <ActivityIndicator color={THEME.colors.blue} {...props} />
);

export default Loader;
