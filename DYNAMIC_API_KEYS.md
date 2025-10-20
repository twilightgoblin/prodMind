# Dynamic API Key Implementation

## Overview

This implementation provides dynamic API key retrieval from the backend, eliminating the need to hardcode API keys in the frontend. When a user clicks to use a service, the frontend requests the API key from the backend server.

## Architecture

```
Frontend (React) → API Key Service → Backend API → Environment Variables
```

## Components

### 1. Backend API Key Route (`server/routes/apiKeys.js`)

**Endpoints:**
- `GET /api/keys` - Get status of all configured services
- `GET /api/keys/:service` - Get API key for specific service

**Supported Services:**
- `youtube` - YouTube Data API v3
- `openai` - OpenAI API
- `gemini` - Google Gemini API
- `anthropic` - Anthropic Claude API

**Environment Variables:**
- `YOUTUBE_API_KEY`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`

### 2. Frontend API Key Service (`src/services/apiKeyService.js`)

**Features:**
- Caches API keys for 5 minutes to reduce backend calls
- Handles errors gracefully with meaningful messages
- Provides service status checking
- Cache management utilities

**Methods:**
- `getApiKey(service)` - Get API key for service
- `getServicesStatus()` - Get all services configuration status
- `clearCache(service)` - Clear cached keys
- `hasCachedKey(service)` - Check if key is cached

### 3. YouTube Service (`src/services/youtubeService.js`)

**Features:**
- Direct YouTube API integration with dynamic keys
- Comprehensive video data formatting
- Error handling with fallback to backend
- Support for search, trending, and channel videos

**Methods:**
- `searchVideos(query, options)` - Search YouTube videos
- `getTrendingVideos(options)` - Get trending videos
- `getChannelVideos(channelId, options)` - Get channel videos
- `getVideoDetails(videoIds)` - Get detailed video information

### 4. API Key Status Component (`src/components/ApiKeyStatus.jsx`)

**Features:**
- Visual status of all API services
- Test functionality for each configured service
- Real-time status updates
- Masked API key display for security

## Usage Examples

### Getting an API Key in Frontend

```javascript
import { apiKeyService } from '../services/apiKeyService.js';

// Get YouTube API key
try {
  const apiKey = await apiKeyService.getApiKey('youtube');
  console.log('API Key retrieved:', apiKey);
} catch (error) {
  console.error('Failed to get API key:', error.message);
}
```

### Using YouTube Service

```javascript
import youtubeService from '../services/youtubeService.js';

// Search videos (automatically gets API key)
try {
  const videos = await youtubeService.searchVideos('React tutorial', {
    maxResults: 10,
    order: 'relevance'
  });
  console.log('Found videos:', videos);
} catch (error) {
  console.error('Search failed:', error.message);
}
```

### Backend API Usage

```bash
# Get all services status
curl http://localhost:5001/api/keys

# Get YouTube API key
curl http://localhost:5001/api/keys/youtube

# Response format:
{
  "service": "youtube",
  "apiKey": "AIzaSyC...",
  "masked": "AIzaSyC...xyz",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Security Considerations

1. **API Key Masking**: Keys are partially masked in status displays
2. **Server-Side Storage**: Keys remain on server, not exposed to client
3. **Caching**: Frontend caches keys temporarily to reduce requests
4. **Error Handling**: Graceful degradation when keys are missing

## Testing

### Backend Testing

Run the test script to verify backend endpoints:

```bash
node test-api-keys.js
```

### Frontend Testing

1. Visit the YouTube Test page
2. Check the API Key Status component
3. Click "Test" buttons to verify key retrieval
4. Try search, trending, and curation features

## Configuration

### Environment Setup

1. Add API keys to `server/.env`:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

2. Restart the server to load new environment variables

### Adding New Services

1. **Backend**: Add service to `serviceKeyMap` in `server/routes/apiKeys.js`
2. **Frontend**: Update `youtubeService.js` or create new service file
3. **Environment**: Add corresponding environment variable

## Benefits

✅ **Security**: API keys never exposed to frontend code  
✅ **Flexibility**: Easy to change keys without frontend updates  
✅ **Caching**: Reduces backend load with intelligent caching  
✅ **Error Handling**: Graceful fallbacks and meaningful error messages  
✅ **Monitoring**: Visual status of all API services  
✅ **Testing**: Built-in testing capabilities for each service  

## Migration from Static Keys

If you previously had hardcoded API keys:

1. Remove any hardcoded keys from frontend code
2. Add keys to backend environment variables
3. Update service calls to use the new dynamic services
4. Test functionality with the API Key Status component

## Troubleshooting

**"API key not found" errors:**
- Check that the environment variable is set in `server/.env`
- Restart the server after adding new environment variables
- Verify the service name matches the supported services list

**"Service not supported" errors:**
- Check that the service is listed in `serviceKeyMap`
- Ensure you're using the correct service name (lowercase)

**Caching issues:**
- Use `apiKeyService.clearCache()` to clear all cached keys
- Keys are automatically refreshed after 5 minutes