import React from 'react';
import { Link } from 'react-router-dom';
import { generateVideoPlayerUrl } from '../utils/videoUtils';

const TestVideoPlayer = () => {
  const testVideos = [
    {
      contentId: 'test_js_basics',
      title: 'JavaScript Tutorial for Beginners',
      url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
      thumbnail: 'https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
      channelTitle: 'freeCodeCamp.org',
      description: 'Learn JavaScript fundamentals in this comprehensive tutorial for beginners.'
    },
    {
      contentId: 'test_simple_video',
      title: 'Simple Test Video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      channelTitle: 'Test Channel',
      description: 'A simple test video to verify embedding works.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#060010] pt-20 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Video Player Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testVideos.map((video) => (
            <div key={video.contentId} className="bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{video.channelTitle}</p>
                <p className="text-gray-300 text-sm mb-4">{video.description}</p>
                
                <Link
                  to={generateVideoPlayerUrl(video)}
                  className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Watch Video
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Test Instructions</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Click "Watch Video" to test the embedded YouTube player</li>
            <li>• The video should play directly on the page (not open in a new tab)</li>
            <li>• Test the scheduling functionality by clicking the "Schedule" button</li>
            <li>• Test the notes functionality by typing in the notes section</li>
            <li>• Verify that progress tracking works when signed in</li>
          </ul>
        </div>
        
        {/* Direct iframe test */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Direct Embed Test</h2>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0"
              title="Direct Test Video"
              style={{ border: 'none' }}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            This is a direct iframe test. If this video loads, the embedding works.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestVideoPlayer;