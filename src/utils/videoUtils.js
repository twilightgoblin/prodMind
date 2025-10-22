// Utility functions for video handling

export const generateVideoPlayerUrl = (videoData) => {
  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(videoData.url) || videoData.id || 'unknown';
  
  // Create URL with video data as search params to avoid additional API calls
  const params = new URLSearchParams({
    title: encodeURIComponent(videoData.title || 'Unknown Title'),
    channel: encodeURIComponent(videoData.channelTitle || 'Unknown Channel'),
    url: encodeURIComponent(videoData.url || ''),
  });

  // Add optional parameters if they exist
  if (videoData.thumbnail) params.append('thumbnail', encodeURIComponent(videoData.thumbnail));
  if (videoData.duration) params.append('duration', videoData.duration);
  if (videoData.viewCount) params.append('views', videoData.viewCount);
  if (videoData.likeCount) params.append('likes', videoData.likeCount);
  if (videoData.commentCount) params.append('comments', videoData.commentCount);
  if (videoData.priority) params.append('priority', videoData.priority);
  if (videoData.tags && videoData.tags.length > 0) params.append('tags', videoData.tags.join(','));
  if (videoData._id) params.append('scheduledId', videoData._id);

  return `/video/${videoId}?${params.toString()}`;
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