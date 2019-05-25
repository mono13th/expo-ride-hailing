import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import THEME from "@theme";

const Button = ({ label, onPress, children, ...props }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.button} {...props}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    borderRadius: THEME.borders.radius,
    elevation: THEME.shadow.elevation,
    padding: THEME.spacing.md,
    flexDirection: "row",
    justifyContent: "center"
  },
  label: {
    textAlign: "center",
    color: "white",
    fontSize: 18
  }
});

export default Button;
