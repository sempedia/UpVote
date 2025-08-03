// src/components/FeatureCard.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from "../styles/globalStyles";
import ApiService from "../services/api";
import StorageService from "../utils/storage";

const FeatureCard = ({ feature, onPress, onVoteChange }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(feature.vote_count || 0);

  useEffect(() => {
    // Check if user has voted for this feature
    checkVoteStatus();
  }, [feature.id]);

  const checkVoteStatus = async () => {
    try {
      const voted = await StorageService.hasUserVoted(feature.id);
      setHasVoted(voted);
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  };

  const handleVote = async () => {
    if (isVoting) return;

    setIsVoting(true);
    try {
      if (hasVoted) {
        // Remove vote
        await ApiService.removeVote(feature.id);
        await StorageService.removeUserVote(feature.id);
        setHasVoted(false);
        setVoteCount((prev) => prev - 1);
      } else {
        // Add vote
        await ApiService.upvoteFeature(feature.id);
        await StorageService.addUserVote(feature.id);
        setHasVoted(true);
        setVoteCount((prev) => prev + 1);
      }

      // Notify parent component of vote change
      if (onVoteChange) {
        onVoteChange(feature.id, !hasVoted);
      }
    } catch (error) {
      console.error("Error voting:", error);
      Alert.alert(
        "Vote Error",
        error.message || "Failed to process your vote. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {feature.title}
          </Text>
          <Text style={styles.date}>{formatDate(feature.created_at)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.voteButton, hasVoted && styles.voteButtonActive]}
          onPress={handleVote}
          disabled={isVoting}
        >
          {isVoting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <>
              <Text style={styles.voteIcon}>{hasVoted ? "❤️" : "🤍"}</Text>
              <Text
                style={[styles.voteCount, hasVoted && styles.voteCountActive]}
              >
                {voteCount}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {feature.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.tapHint}>Tap to view details</Text>
        {hasVoted && (
          <Text style={styles.votedIndicator}>You voted for this</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  description: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  voteButton: {
    backgroundColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    minHeight: 50,
  },
  voteButtonActive: {
    backgroundColor: colors.error,
  },
  voteIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  voteCount: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  voteCountActive: {
    color: colors.surface,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tapHint: {
    ...typography.small,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  votedIndicator: {
    ...typography.small,
    color: colors.success,
    fontWeight: "600",
  },
});

export default FeatureCard;
