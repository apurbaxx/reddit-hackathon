import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      appDisplayName: 'mystery-frame',
    },
    subredditName: subredditName,
    title: '🎭 Guess the Celeb Challenge! Can you identify this celebrity?',
  });
};
