import React from "react";
import { Image } from "react-native";
import { MapView } from "expo";

import Pin from "../../../assets/marker.png";

const Marker = ({ ...props }) => (
  <MapView.Marker {...props}>
    <Image source={Pin} style={{ width: 36, height: 36 }} />
  </MapView.Marker>
);

export default Marker;
