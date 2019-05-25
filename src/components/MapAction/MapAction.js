import React from "react";
import { View, StyleSheet } from "react-native";

import THEME from "../../theme";

const MapAction = ({ ...props }) => (
  <View style={styles.mapAction} {...props} />
);

const styles = StyleSheet.create({
  mapAction: {
    marginTop: "auto",
    marginBottom: THEME.spacing.lg,
    marginLeft: THEME.spacing.lg,
    marginRight: THEME.spacing.lg
  }
});

export default MapAction;
