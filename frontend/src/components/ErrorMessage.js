// src/components/ErrorMessage.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from "../styles/globalStyles";

const ErrorMessage = ({
  message = "Something went wrong",
  onRetry,
  retryText = "Try Again",
  showRetry = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {showRetry && onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    margin: spacing.md,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryText: {
    color: colors.surface,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
});

export default ErrorMessage;
