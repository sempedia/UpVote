// src/components/LoadingSpinner.js
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  typography,
  globalStyles,
} from "../styles/globalStyles";

const LoadingSpinner = ({
  message = "Loading...",
  size = "large",
  color = colors.primary,
}) => {
  return (
    <View style={[globalStyles.centerContent, styles.container]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: "center",
  },
});

export default LoadingSpinner;
