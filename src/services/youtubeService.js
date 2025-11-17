import { apiKeyService } from './apiKeyService.js';

class YouTubeService {
  constructor() {
    this.baseURL = 'https://www.googleapis.com/youtube/v3';
    this.apiKey = null;
  }

  /**
   * Get API key dynamically from backend
   */
  async getApiKey() {
    if (!this.apiKey) {
      this.apiKey = await apiKeyService.getApiKey('youtube');
    }
    return this.apiKey;
  }

  /**
   * Search YouTube videos
   * @param {string} query - Search query
   * @param {Object} options - Search options
   */
  async searchVideos(query, options = {}) {
    try {
      const apiKey = await this.getApiKey();
      const {
        maxResults = 10,
        order = 'relevance',
        publishedAfter = null,
        duration = null,
        type = 'video'
      } = options;

      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type,
        maxResults,
        order,
        key: apiKey
      });

      if (publishedAfter) {
        params.append('publishedAfter', publishedAfter);
      }

      if (duration) {
        params.append('videoDuration', duration);
      }

      const response = await fetch(`${this.baseURL}/search?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'YouTube API request failed');
      }

      const data = await response.json();
      
      // Get additional video details if we have video IDs
      const videoIds = data.items
        .filter(item => item.id.kind === 'youtube#video')
        .map(item => item.id.videoId);

      if (videoIds.length > 0) {
        const videoDetails = await this.getVideoDetails(videoIds);
        
        // Merge search results with detailed video info
        return data.items.map(item => {
          if (item.id.kind === 'youtube#video') {
            const details = videoDetails.find(v => v.id === item.id.videoId);
            return this.formatVideoData(item, details);
          }
          return this.formatVideoData(item);
        });
      }

      return data.items.map(item => this.formatVideoData(item));
      
    } catch (error) {
      console.error('YouTube search failed:', error);
      throw error;
    }
  }

  /**
   * Get video details by IDs
   * @param {Array} videoIds - Array of video IDs
   */
  async getVideoDetails(videoIds) {
    try {
      const apiKey = await this.getApiKey();
      const params = new URLSearchParams({
        part: 'snippet,statistics,contentDetails',
        id: videoIds.join(','),
        key: apiKey
      });

      const response = await fetch(`${this.baseURL}/videos?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'YouTube API request failed');
      }

      const data = await response.json();
      return data.items;
      
    } catch (error) {
      console.error('Failed to get video details:', error);
      return [];
    }
  }

  /**
   * Get trending videos
   * @param {Object} options - Options for trending videos
   */
  async getTrendingVideos(options = {}) {
    try {
      const apiKey = await this.getApiKey();
      const {
        maxResults = 10,
        categoryId = '0',
        regionCode = 'US'
      } = options;

      const params = new URLSearchParams({
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        maxResults,
        regionCode,
        key: apiKey
      });

      if (categoryId !== '0') {
        params.append('videoCategoryId', categoryId);
      }

      const response = await fetch(`${this.baseURL}/videos?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'YouTube API request failed');
      }

      const data = await response.json();
      return data.items.map(item => this.formatVideoData(item));
      
    } catch (error) {
      console.error('Failed to get trending videos:', error);
      throw error;
    }
  }

  /**
   * Get channel videos
   * @param {string} channelId - Channel ID
   * @param {Object} options - Options
   */
  async getChannelVideos(channelId, options = {}) {
    try {
      const apiKey = await this.getApiKey();
      const { maxResults = 10, order = 'date' } = options;

      const params = new URLSearchParams({
        part: 'snippet',
        channelId,
        type: 'video',
        order,
        maxResults,
        key: apiKey
      });

      const response = await fetch(`${this.baseURL}/search?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'YouTube API request failed');
      }

      const data = await response.json();
      
      // Get video details
      const videoIds = data.items.map(item => item.id.videoId);
      const videoDetails = await this.getVideoDetails(videoIds);
      
      return data.items.map(item => {
        const details = videoDetails.find(v => v.id === item.id.videoId);
        return this.formatVideoData(item, details);
      });
      
    } catch (error) {
      console.error('Failed to get channel videos:', error);
      throw error;
    }
  }

  /**
   * Format video data into consistent structure
   * @param {Object} searchItem - Search result item
   * @param {Object} videoDetails - Detailed video info
   */
  formatVideoData(searchItem, videoDetails = null) {
    const snippet = searchItem.snippet;
    const statistics = videoDetails?.statistics || searchItem.statistics || {};
    const contentDetails = videoDetails?.contentDetails || searchItem.contentDetails || {};

    return {
      id: searchItem.id?.videoId || searchItem.id,
      title: snippet.title,
      description: snippet.description,
      thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
      channelTitle: snippet.channelTitle,
      channelId: snippet.channelId,
      publishedAt: snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${searchItem.id?.videoId || searchItem.id}`,
      duration: contentDetails.duration,
      viewCount: statistics.viewCount,
      likeCount: statistics.likeCount,
      commentCount: statistics.commentCount,
      tags: snippet.tags || []
    };
  }

  /**
   * Clear cached API key (useful when key changes)
   */
  clearApiKey() {
    this.apiKey = null;
    apiKeyService.clearCache('youtube');
  }
}

export const youtubeService = new YouTubeService();
export default youtubeService;