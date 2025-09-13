// Shared game timing constants
export const GAME_TIMING = {
  BLUR_REVEAL_INTERVAL: 30 * 60 * 1000, // 30 minutes in milliseconds
  TOTAL_GAME_DURATION: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  GAME_RESTART_DELAY: 5 * 60 * 1000, // 5 minutes delay before new game starts
  GUESS_COOLDOWN: 30 * 60 * 1000, // 30 minutes cooldown after incorrect guess
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

export type UserAttempt = {
  username: string;
  lastAttemptTime: number; // timestamp of last attempt
  hasGuessedCorrectly: boolean; // whether user has already guessed correctly this round
  nextAllowedAttemptTime: number; // timestamp when user can attempt again (if they were wrong)
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
  userAttempts: UserAttempt[]; // track user attempts and cooldowns
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

export type GuessSubmissionRequest = {
  postId: string;
  guess: string;
  username: string;
};

export type GuessSubmissionResponse = {
  type: 'guess-submission';
  isCorrect: boolean;
  message?: string;
  canGuessAgain: boolean;
  nextAllowedAttemptTime?: number; // timestamp when user can attempt again
};

export type UserEligibilityResponse = {
  type: 'user-eligibility';
  canGuess: boolean;
  hasAlreadyWon: boolean;
  nextAllowedAttemptTime?: number;
  timeUntilNextAttempt?: number; // milliseconds until can attempt again
};
