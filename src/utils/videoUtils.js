// Utility functions for video handling

export const generateVideoPlayerUrl = (videoData) => {
  // Extract video ID from YouTube URL or use contentId
  const getVideoId = (url) => {
    if (!url) return null;
    
    let cleanUrl = url.trim();
    if (cleanUrl.includes('%')) {
      try {
        cleanUrl = decodeURIComponent(cleanUrl);
      } catch (e) {
        // Use original URL if decoding fails
      }
    }
    
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }
    
    return null;
  };

  const extractedVideoId = getVideoId(videoData.url);
  const contentId = videoData.contentId || videoData.id || extractedVideoId || 'unknown';
  
  // Create URL with video data as search params to avoid additional API calls
  // URLSearchParams automatically handles encoding, so we don't need to manually encode
  const params = new URLSearchParams({
    url: videoData.url || '',
    title: videoData.title || 'Unknown Title',
    channelTitle: videoData.channelTitle || 'Unknown Channel'
  });

  // Add optional parameters if they exist
  if (videoData.thumbnail) params.append('thumbnail', videoData.thumbnail);
  if (videoData.description) params.append('description', videoData.description);
  if (videoData.duration) params.append('duration', videoData.duration);
  if (videoData.viewCount) params.append('views', videoData.viewCount);
  if (videoData.likeCount) params.append('likes', videoData.likeCount);
  if (videoData.commentCount) params.append('comments', videoData.commentCount);
  if (videoData.priority) params.append('priority', videoData.priority);
  if (videoData.tags && videoData.tags.length > 0) params.append('tags', videoData.tags.join(','));
  if (videoData._id) params.append('scheduledId', videoData._id);

  return `/video/${contentId}?${params.toString()}`;
};

export const createWatchButton = (videoData, className = '', children = 'Watch') => {
  const videoPlayerUrl = generateVideoPlayerUrl(videoData);
  
  return {
    href: videoPlayerUrl,
    target: '_self', // Keep within the app
    className: className,
    children: children
  };
};