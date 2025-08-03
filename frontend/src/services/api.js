/ src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making ${config.method || 'GET'} request to:`, url);
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Get all features
  async getFeatures() {
    return this.makeRequest('/features/');
  }

  // Get a specific feature by ID
  async getFeature(id) {
    return this.makeRequest(`/features/${id}/`);
  }

  // Create a new feature
  async createFeature(featureData) {
    return this.makeRequest('/features/', {
      method: 'POST',
      body: JSON.stringify(featureData),
    });
  }

  // Update a feature
  async updateFeature(id, featureData) {
    return this.makeRequest(`/features/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(featureData),
    });
  }

  // Delete a feature
  async deleteFeature(id) {
    return this.makeRequest(`/features/${id}/`, {
      method: 'DELETE',
    });
  }

  // Upvote a feature
  async upvoteFeature(id) {
    return this.makeRequest(`/features/${id}/upvote/`, {
      method: 'POST',
    });
  }

  // Remove vote from a feature
  async removeVote(id) {
    return this.makeRequest(`/features/${id}/remove-vote/`, {
      method: 'DELETE',
    });
  }

  // Get feature statistics
  async getFeatureStats(id) {
    return this.makeRequest(`/features/${id}/stats/`);
  }

  // Health check
  async healthCheck() {
    const url = 'http://localhost:8000/health/';
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw new Error('Backend is not available');
    }
  }
}

// Export a singleton instance
export default new ApiService();