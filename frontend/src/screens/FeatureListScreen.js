// src/screens/FeatureListScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  colors,
  spacing,
  typography,
  globalStyles,
  borderRadius,
} from "../styles/globalStyles";
import FeatureCard from "../components/FeatureCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ApiService from "../services/api";
import StorageService from "../utils/storage";

const FeatureListScreen = ({ navigation }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Load features when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFeatures();
    }, [])
  );

  const loadFeatures = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);

    try {
      // Try to load cached features first (for better UX)
      if (!isRefresh) {
        const cachedFeatures = await StorageService.getCachedFeatures();
        if (cachedFeatures) {
          setFeatures(cachedFeatures);
        }
      }

      // Fetch fresh data from API
      const freshFeatures = await ApiService.getFeatures();
      setFeatures(freshFeatures);

      // Cache the fresh data
      await StorageService.cacheFeatures(freshFeatures);
    } catch (err) {
      console.error("Error loading features:", err);
      setError(err.message || "Failed to load features");

      // If no cached data and API fails, show error
      if (features.length === 0) {
        setFeatures([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFeatures(true);
  };

  const handleFeaturePress = (feature) => {
    navigation.navigate("FeatureDetail", {
      featureId: feature.id,
      feature: feature,
    });
  };

  const handleVoteChange = (featureId, hasVoted) => {
    // Update the local state when a vote changes
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) => {
        if (feature.id === featureId) {
          return {
            ...feature,
            vote_count: hasVoted
              ? feature.vote_count + 1
              : feature.vote_count - 1,
          };
        }
        return feature;
      })
    );
  };

  const navigateToNewFeature = () => {
    navigation.navigate("NewFeature");
  };

  const renderFeatureItem = ({ item }) => (
    <FeatureCard
      feature={item}
      onPress={() => handleFeaturePress(item)}
      onVoteChange={handleVoteChange}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💡</Text>
      <Text style={styles.emptyTitle}>No Features Yet</Text>
      <Text style={styles.emptyMessage}>
        Be the first to suggest a new feature!
      </Text>
      <TouchableOpacity
        style={globalStyles.button}
        onPress={navigateToNewFeature}
      >
        <Text style={globalStyles.buttonText}>Add First Feature</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Feature Requests</Text>
      <Text style={styles.headerSubtitle}>
        {features.length} feature{features.length !== 1 ? "s" : ""} suggested
      </Text>
    </View>
  );

  if (loading && features.length === 0) {
    return (
      <View style={globalStyles.container}>
        <LoadingSpinner message="Loading features..." />
      </View>
    );
  }

  if (error && features.length === 0) {
    return (
      <View style={globalStyles.container}>
        <ErrorMessage message={error} onRetry={() => loadFeatures()} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={features}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFeatureItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={
          features.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        showsVerticalScrollIndicator={false}
      />

      {features.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={navigateToNewFeature}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
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
  listContainer: {
    paddingBottom: 80, // Space for FAB
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  fab: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 24,
    color: colors.surface,
    fontWeight: "bold",
  },
});

export default FeatureListScreen;
