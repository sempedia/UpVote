// src/screens/FeatureDetailScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  globalStyles,
  borderRadius,
  shadows,
} from "../styles/globalStyles";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ApiService from "../services/api";
import StorageService from "../utils/storage";

const FeatureDetailScreen = ({ route, navigation }) => {
  const { featureId, feature: initialFeature } = route.params;

  const [feature, setFeature] = useState(initialFeature || null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(!initialFeature);
  const [statsLoading, setStatsLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    loadFeatureData();
    checkVoteStatus();
  }, [featureId]);

  const loadFeatureData = async () => {
    if (!initialFeature) setLoading(true);
    setError(null);

    try {
      // Load feature details and stats in parallel
      const [featureData, statsData] = await Promise.all([
        initialFeature
          ? Promise.resolve(initialFeature)
          : ApiService.getFeature(featureId),
        loadStats(),
      ]);

      setFeature(featureData);
    } catch (err) {
      console.error("Error loading feature:", err);
      setError(err.message || "Failed to load feature details");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const statsData = await ApiService.getFeatureStats(featureId);
      setStats(statsData);
      return statsData;
    } catch (err) {
      console.error("Error loading stats:", err);
      // Stats are not critical, so don't show error for this
    } finally {
      setStatsLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    try {
      const voted = await StorageService.hasUserVoted(featureId);
      setHasVoted(voted);
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  };

  const handleVote = async () => {
    if (voting) return;

    setVoting(true);
    try {
      if (hasVoted) {
        // Remove vote
        await ApiService.removeVote(featureId);
        await StorageService.removeUserVote(featureId);
        setHasVoted(false);
        setFeature((prev) => ({
          ...prev,
          vote_count: prev.vote_count - 1,
        }));
      } else {
        // Add vote
        await ApiService.upvoteFeature(featureId);
        await StorageService.addUserVote(featureId);
        setHasVoted(true);
        setFeature((prev) => ({
          ...prev,
          vote_count: prev.vote_count + 1,
        }));
      }

      // Reload stats to show updated vote count
      loadStats();
    } catch (error) {
      console.error("Error voting:", error);
      Alert.alert(
        "Vote Error",
        error.message || "Failed to process your vote. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setVoting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatsDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <LoadingSpinner message="Loading feature details..." />
      </View>
    );
  }

  if (error || !feature) {
    return (
      <View style={globalStyles.container}>
        <ErrorMessage
          message={error || "Feature not found"}
          onRetry={loadFeatureData}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{feature.title}</Text>
          <Text style={styles.createdDate}>
            Created on {formatDate(feature.created_at)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.voteButton, hasVoted && styles.voteButtonActive]}
          onPress={handleVote}
          disabled={voting}
        >
          {voting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <>
              <Text style={styles.voteIcon}>{hasVoted ? "❤️" : "🤍"}</Text>
              <Text
                style={[styles.voteCount, hasVoted && styles.voteCountActive]}
              >
                {feature.vote_count || 0}
              </Text>
              <Text
                style={[styles.voteLabel, hasVoted && styles.voteLabelActive]}
              >
                {feature.vote_count === 1 ? "vote" : "votes"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Description Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{feature.description}</Text>
      </View>

      {/* Vote Status Card */}
      {hasVoted && (
        <View style={[styles.card, styles.voteStatusCard]}>
          <Text style={styles.voteStatusIcon}>✅</Text>
          <Text style={styles.voteStatusText}>You voted for this feature</Text>
          <Text style={styles.voteStatusSubtext}>
            Tap the vote button above to remove your vote
          </Text>
        </View>
      )}

      {/* Stats Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Statistics</Text>

        {statsLoading ? (
          <View style={styles.statsLoading}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.statsLoadingText}>Loading stats...</Text>
          </View>
        ) : stats ? (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total_votes}</Text>
              <Text style={styles.statLabel}>Total Votes</Text>
            </View>

            {stats.recent_votes && stats.recent_votes.length > 0 && (
              <View style={styles.recentVotes}>
                <Text style={styles.recentVotesTitle}>Recent Votes</Text>
                {stats.recent_votes.slice(0, 5).map((vote, index) => (
                  <View key={index} style={styles.recentVoteItem}>
                    <Text style={styles.recentVoteText}>
                      User {vote.user_identifier} voted
                    </Text>
                    <Text style={styles.recentVoteDate}>
                      {formatStatsDate(vote.created_at)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.noStats}>Stats unavailable</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonSecondary]}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[globalStyles.buttonText, globalStyles.buttonSecondaryText]}
          >
            Back to List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadStats}
          disabled={statsLoading}
        >
          <Text style={styles.refreshButtonText}>
            {statsLoading ? "Refreshing..." : "🔄 Refresh Stats"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleSection: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 36,
  },
  createdDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  voteButton: {
    backgroundColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  voteButtonActive: {
    backgroundColor: colors.error,
  },
  voteIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  voteCount: {
    ...typography.h3,
    color: colors.textSecondary,
    fontWeight: "bold",
    marginBottom: 2,
  },
  voteCountActive: {
    color: colors.surface,
  },
  voteLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  voteLabelActive: {
    color: colors.surface,
  },
  card: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  voteStatusCard: {
    backgroundColor: colors.success,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  voteStatusIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  voteStatusText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: "600",
    flex: 1,
  },
  voteStatusSubtext: {
    ...typography.caption,
    color: colors.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  statsContainer: {
    alignItems: "center",
  },
  statsLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
  },
  statsLoadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
  statItem: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  statNumber: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: "bold",
  },
  statLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  recentVotes: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  recentVotesTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  recentVoteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentVoteText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  recentVoteDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  noStats: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
  actionButtons: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.md,
  },
  refreshButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  refreshButtonText: {
    color: colors.surface,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
});

export default FeatureDetailScreen;
