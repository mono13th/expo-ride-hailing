import React from "react";
import { MapView } from "expo";

const Route = ({ ...props }) => (
  <MapView.Polyline strokeWidth={5} strokeColor="#000000" {...props} />
);

export default Route;
