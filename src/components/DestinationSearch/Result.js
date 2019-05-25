import React from "react";
import { Text, StyleSheet } from "react-native";

import THEME from "../../theme";

const Result = ({ ...props }) => <Text style={styles.result} {...props} />;

const styles = StyleSheet.create({
  result: {
    padding: THEME.spacing.sm
  }
});

export default Result;
