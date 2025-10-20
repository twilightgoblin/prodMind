// Temporary debug file to check environment variables
console.log('=== Environment Variables Debug ===');
console.log('VITE_YOUTUBE_API_KEY:', import.meta.env.VITE_YOUTUBE_API_KEY);
console.log('VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY);
console.log('All env vars:', import.meta.env);
console.log('Mode:', import.meta.env.MODE);
console.log('Dev:', import.meta.env.DEV);

export const debugEnv = () => {
  const youtube = import.meta.env.VITE_YOUTUBE_API_KEY;
  const openai = import.meta.env.VITE_OPENAI_API_KEY;
  
  console.log('YouTube key type:', typeof youtube, 'Value:', youtube);
  console.log('OpenAI key type:', typeof openai, 'Value:', openai);
  
  return {
    youtube,
    openai
  };
};