import React from "react";
import { Image } from "react-native";
import { MapView } from "expo";

import Src from "@assets/driver_marker.png";

const Marker = ({ ...props }) => (
  <MapView.Marker {...props}>
    <Image source={Src} style={{ width: 19, height: 42 }} />
  </MapView.Marker>
);

export default Marker;
