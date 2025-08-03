/ src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_VOTES: 'user_votes',
  USER_IP: 'user_ip',
  CACHED_FEATURES: 'cached_features',
};

class StorageService {
  // Get user's voted features
  async getUserVotes() {
    try {
      const votes = await AsyncStorage.getItem(STORAGE_KEYS.USER_VOTES);
      return votes ? JSON.parse(votes) : [];
    } catch (error) {
      console.error('Error getting user votes:', error);
      return [];
    }
  }

  // Add a feature ID to user's voted list
  async addUserVote(featureId) {
    try {
      const currentVotes = await this.getUserVotes();
      if (!currentVotes.includes(featureId)) {
        const updatedVotes = [...currentVotes, featureId];
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_VOTES,
          JSON.stringify(updatedVotes)
        );
      }
    } catch (error) {
      console.error('Error adding user vote:', error);
    }
  }

  // Remove a feature ID from user's voted list
  async removeUserVote(featureId) {
    try {
      const currentVotes = await this.getUserVotes();
      const updatedVotes = currentVotes.filter(id => id !== featureId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_VOTES,
        JSON.stringify(updatedVotes)
      );
    } catch (error) {
      console.error('Error removing user vote:', error);
    }
  }

  // Check if user has voted for a feature
  async hasUserVoted(featureId) {
    try {
      const votes = await this.getUserVotes();
      return votes.includes(featureId);
    } catch (error) {
      console.error('Error checking user vote:', error);
      return false;
    }
  }

  // Cache features list
  async cacheFeatures(features) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CACHED_FEATURES,
        JSON.stringify({
          data: features,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error caching features:', error);
    }
  }

  // Get cached features
  async getCachedFeatures(maxAge = 5 * 60 * 1000) { // 5 minutes default
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_FEATURES);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < maxAge) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting cached features:', error);
      return null;
    }
  }

  // Store user IP (for debugging/display purposes)
  async storeUserIP(ip) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_IP, ip);
    } catch (error) {
      console.error('Error storing user IP:', error);
    }
  }

  // Get stored user IP
  async getUserIP() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_IP);
    } catch (error) {
      console.error('Error getting user IP:', error);
      return null;
    }
  }

  // Clear all stored data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

// Export a singleton instance
export default new StorageService();