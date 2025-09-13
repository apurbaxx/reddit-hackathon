// Shared game timing constants
export const GAME_TIMING = {
  BLUR_REVEAL_INTERVAL: 30 * 60 * 1000, // 30 minutes in milliseconds
  TOTAL_GAME_DURATION: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  GAME_RESTART_DELAY: 5 * 60 * 1000, // 5 minutes delay before new game starts
} as const;

export type InitResponse = {
  type: 'init';
  postId: string;
  username: string;
  gameState: GameState;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

export type GameState = {
  celebrityName: string;
  currentBlurLevel: number; // 0-3 (0 = most blurred, 3 = clear)
  gamePhase: 'active' | 'revealed'; // active = game ongoing, revealed = final reveal
  startTime: number; // timestamp when game started
  nextRevealTime: number; // timestamp for next blur reduction
  winners: string[]; // usernames of correct guessers
  isGameOver: boolean;
  imageUrl: string;
  blurredImages: string[]; // URLs for different blur levels
};

export type Celebrity = {
  id: string;
  name: string;
  imageUrl: string;
  aliases?: string[]; // Alternative names for fuzzy matching
};

export type GameUpdateResponse = {
  type: 'game-update';
  postId: string;
  gameState: GameState;
};

export type CommentCheckResponse = {
  type: 'comment-check';
  isCorrect: boolean;
  message?: string;
};
