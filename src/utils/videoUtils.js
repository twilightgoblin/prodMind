// Utility functions for video handling

export const generateVideoPlayerUrl = (videoData) => {
  // Extract video ID from YouTube URL or use contentId
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const contentId = videoData.contentId || videoData.id || getVideoId(videoData.url) || 'unknown';
  
  // Create URL with video data as search params to avoid additional API calls
  const params = new URLSearchParams({
    url: encodeURIComponent(videoData.url || ''),
    title: encodeURIComponent(videoData.title || 'Unknown Title'),
    channelTitle: encodeURIComponent(videoData.channelTitle || 'Unknown Channel')
  });

  // Add optional parameters if they exist
  if (videoData.thumbnail) params.append('thumbnail', encodeURIComponent(videoData.thumbnail));
  if (videoData.description) params.append('description', encodeURIComponent(videoData.description));
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