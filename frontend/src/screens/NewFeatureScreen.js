// src/screens/NewFeatureScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  globalStyles,
  borderRadius,
} from "../styles/globalStyles";
import LoadingSpinner from "../components/LoadingSpinner";
import ApiService from "../services/api";

const NewFeatureScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setTitleError("");
    setDescriptionError("");

    // Validate title
    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (title.trim().length < 3) {
      setTitleError("Title must be at least 3 characters long");
      isValid = false;
    } else if (title.trim().length > 200) {
      setTitleError("Title must be less than 200 characters");
      isValid = false;
    }

    // Validate description
    if (!description.trim()) {
      setDescriptionError("Description is required");
      isValid = false;
    } else if (description.trim().length < 10) {
      setDescriptionError("Description must be at least 10 characters long");
      isValid = false;
    } else if (description.trim().length > 1000) {
      setDescriptionError("Description must be less than 1000 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || submitting) return;

    setSubmitting(true);
    try {
      const featureData = {
        title: title.trim(),
        description: description.trim(),
      };

      const newFeature = await ApiService.createFeature(featureData);

      Alert.alert("Success!", "Your feature request has been submitted.", [
        {
          text: "View Feature",
          onPress: () => {
            navigation.replace("FeatureDetail", {
              featureId: newFeature.id,
              feature: newFeature,
            });
          },
        },
        {
          text: "Add Another",
          onPress: () => {
            setTitle("");
            setDescription("");
          },
        },
        {
          text: "Back to List",
          onPress: () => navigation.navigate("FeatureList"),
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Error creating feature:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to create feature. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      Alert.alert(
        "Discard Changes?",
        "Are you sure you want to discard your feature request?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (submitting) {
    return (
      <View style={globalStyles.container}>
        <LoadingSpinner message="Creating your feature request..." />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Suggest a Feature</Text>
          <Text style={styles.headerSubtitle}>
            Help us improve by sharing your ideas
          </Text>
        </View>

        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Feature Title *</Text>
            <TextInput
              style={[
                globalStyles.input,
                titleError && globalStyles.inputError,
                styles.titleInput,
              ]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (titleError) setTitleError("");
              }}
              placeholder="e.g., Dark mode support"
              placeholderTextColor={colors.textSecondary}
              maxLength={200}
              returnKeyType="next"
              blurOnSubmit={false}
            />
            <View style={styles.inputFooter}>
              {titleError ? (
                <Text style={globalStyles.errorText}>{titleError}</Text>
              ) : null}
              <Text style={styles.characterCount}>{title.length}/200</Text>
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[
                globalStyles.input,
                descriptionError && globalStyles.inputError,
                styles.descriptionInput,
              ]}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (descriptionError) setDescriptionError("");
              }}
              placeholder="Describe your feature idea in detail. What problem does it solve? How should it work?"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              maxLength={1000}
              textAlignVertical="top"
            />
            <View style={styles.inputFooter}>
              {descriptionError ? (
                <Text style={globalStyles.errorText}>{descriptionError}</Text>
              ) : null}
              <Text style={styles.characterCount}>
                {description.length}/1000
              </Text>
            </View>
          </View>

          {/* Preview Card */}
          {(title.trim() || description.trim()) && (
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>Preview</Text>
              <View style={styles.previewContent}>
                <Text style={styles.previewFeatureTitle}>
                  {title.trim() || "Feature Title"}
                </Text>
                <Text style={styles.previewFeatureDescription}>
                  {description.trim() ||
                    "Feature description will appear here..."}
                </Text>
                <View style={styles.previewMeta}>
                  <Text style={styles.previewMetaText}>0 votes • Just now</Text>
                </View>
              </View>
            </View>
          )}

          {/* Guidelines */}
          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>
              💡 Tips for a great feature request:
            </Text>
            <Text style={styles.guidelineItem}>
              • Be specific about the problem you're solving
            </Text>
            <Text style={styles.guidelineItem}>
              • Explain why this feature would be valuable
            </Text>
            <Text style={styles.guidelineItem}>
              • Consider how it might work for other users
            </Text>
            <Text style={styles.guidelineItem}>
              • Check if similar features already exist
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonSecondary,
            styles.cancelButton,
          ]}
          onPress={handleCancel}
        >
          <Text
            style={[globalStyles.buttonText, globalStyles.buttonSecondaryText]}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={globalStyles.buttonText}>Submit Feature</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  titleInput: {
    fontSize: typography.h3.fontSize,
  },
  descriptionInput: {
    minHeight: 120,
    paddingTop: spacing.md,
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  characterCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
  },
  previewTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  previewContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  previewFeatureTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  previewFeatureDescription: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  previewMeta: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  previewMetaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  guidelines: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  guidelinesTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  guidelineItem: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: "row",
    padding: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default NewFeatureScreen;
