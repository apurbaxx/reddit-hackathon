import { GameState, GAME_TIMING, UserAttempt } from '../../shared/types/api';
import { getRandomCelebrity, generateBlurredImageUrls } from './celebrities';

const BLUR_REVEAL_INTERVAL = GAME_TIMING.BLUR_REVEAL_INTERVAL;
const TOTAL_GAME_DURATION = GAME_TIMING.TOTAL_GAME_DURATION;
const GAME_RESTART_DELAY = GAME_TIMING.GAME_RESTART_DELAY;
const GUESS_COOLDOWN = GAME_TIMING.GUESS_COOLDOWN;

export class GameService {
  // Create a new game
  static async createNewGame(
    getAssetURL?: (filename: string) => Promise<string>
  ): Promise<GameState> {
    const celebrity = getRandomCelebrity();
    const startTime = Date.now();

    // Get the proper Reddit CDN URL for the celebrity image if getAssetURL is provided
    let imageUrl = celebrity.imageUrl;
    if (getAssetURL) {
      try {
        imageUrl = await getAssetURL(celebrity.imageUrl);
      } catch (error) {
        console.error('Failed to get asset URL for', celebrity.imageUrl, error);
        // Fall back to original filename if asset URL resolution fails
        imageUrl = celebrity.imageUrl;
      }
    }

    const blurredImages = generateBlurredImageUrls(imageUrl);

    return {
      celebrityName: celebrity.name,
      currentBlurLevel: 0, // Start with most blurred
      gamePhase: 'active',
      startTime,
      nextRevealTime: startTime + BLUR_REVEAL_INTERVAL,
      winners: [],
      isGameOver: false,
      imageUrl: imageUrl,
      blurredImages,
      userAttempts: [], // Initialize empty user attempts array
    };
  }

  // Update game state based on current time
  static async updateGameState(
    gameState: GameState,
    getAssetURL?: (filename: string) => Promise<string>
  ): Promise<GameState> {
    const currentTime = Date.now();
    const elapsedTime = currentTime - gameState.startTime;

    // If game is over, check if it's time to start a new game
    if (gameState.isGameOver) {
      const timeSinceGameEnd = currentTime - (gameState.startTime + TOTAL_GAME_DURATION);

      // If 5 minutes have passed since game ended, start a new game
      if (timeSinceGameEnd >= GAME_RESTART_DELAY) {
        return GameService.createNewGame(getAssetURL);
      }

      // Otherwise, keep the current ended game state
      return gameState;
    }

    // Calculate what blur level we should be at based on elapsed time
    const intervals = Math.floor(elapsedTime / BLUR_REVEAL_INTERVAL);
    const newBlurLevel = Math.min(intervals, 3); // Max level is 3 (lightly blurred image)

    // Check if game should be over (2 hours passed)
    const isGameOver = elapsedTime >= TOTAL_GAME_DURATION;

    // Calculate next reveal time
    let nextRevealTime = gameState.nextRevealTime;
    if (newBlurLevel > gameState.currentBlurLevel && !isGameOver) {
      nextRevealTime = gameState.startTime + (newBlurLevel + 1) * BLUR_REVEAL_INTERVAL;
    }

    return {
      ...gameState,
      currentBlurLevel: newBlurLevel,
      gamePhase: isGameOver ? 'revealed' : 'active',
      nextRevealTime: isGameOver ? 0 : nextRevealTime,
      isGameOver,
    };
  }

  // Add winner to the game
  static addWinner(gameState: GameState, username: string): GameState {
    if (gameState.winners.includes(username)) {
      return gameState; // Already a winner
    }

    return {
      ...gameState,
      winners: [...gameState.winners, username],
    };
  }

  // Get time remaining until next reveal
  static getTimeUntilNextReveal(gameState: GameState): number {
    if (gameState.isGameOver) return 0;
    return Math.max(0, gameState.nextRevealTime - Date.now());
  }

  // Get time remaining until game ends
  static getTimeUntilGameEnd(gameState: GameState): number {
    const endTime = gameState.startTime + TOTAL_GAME_DURATION;
    return Math.max(0, endTime - Date.now());
  }

  // Get time until next game starts (when current game is over)
  static getTimeUntilNextGame(gameState: GameState): number {
    if (!gameState.isGameOver) return 0;
    const nextGameStartTime = gameState.startTime + TOTAL_GAME_DURATION + GAME_RESTART_DELAY;
    return Math.max(0, nextGameStartTime - Date.now());
  }

  // Format time for display (returns object with hours, minutes, seconds)
  static formatTime(milliseconds: number): { hours: number; minutes: number; seconds: number } {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  }

  // Get current image URL based on blur level
  static getCurrentImageUrl(gameState: GameState): string {
    return gameState.blurredImages[gameState.currentBlurLevel] || gameState.imageUrl;
  }

  // Check if user can make a guess
  static canUserGuess(
    gameState: GameState,
    username: string
  ): {
    canGuess: boolean;
    hasAlreadyWon: boolean;
    nextAllowedAttemptTime?: number;
    timeUntilNextAttempt?: number;
  } {
    // If game is over, no one can guess
    if (gameState.isGameOver || gameState.gamePhase !== 'active') {
      return { canGuess: false, hasAlreadyWon: false };
    }

    // Check if user has already won
    const hasAlreadyWon = gameState.winners.includes(username);
    if (hasAlreadyWon) {
      return { canGuess: false, hasAlreadyWon: true };
    }

    // Find user's attempt record
    const userAttempt = gameState.userAttempts.find((attempt) => attempt.username === username);

    if (!userAttempt) {
      // First time user, can guess
      return { canGuess: true, hasAlreadyWon: false };
    }

    // If user has already guessed correctly, they can't guess again
    if (userAttempt.hasGuessedCorrectly) {
      return { canGuess: false, hasAlreadyWon: true };
    }

    // Check if cooldown period has passed
    const currentTime = Date.now();
    if (currentTime < userAttempt.nextAllowedAttemptTime) {
      const timeUntilNextAttempt = userAttempt.nextAllowedAttemptTime - currentTime;
      return {
        canGuess: false,
        hasAlreadyWon: false,
        nextAllowedAttemptTime: userAttempt.nextAllowedAttemptTime,
        timeUntilNextAttempt,
      };
    }

    // User can guess
    return { canGuess: true, hasAlreadyWon: false };
  }

  // Record a user attempt
  static recordUserAttempt(gameState: GameState, username: string, isCorrect: boolean): GameState {
    const currentTime = Date.now();
    const existingAttemptIndex = gameState.userAttempts.findIndex(
      (attempt) => attempt.username === username
    );

    const newAttempt: UserAttempt = {
      username,
      lastAttemptTime: currentTime,
      hasGuessedCorrectly: isCorrect,
      nextAllowedAttemptTime: isCorrect ? 0 : currentTime + GUESS_COOLDOWN,
    };

    let updatedUserAttempts: UserAttempt[];

    if (existingAttemptIndex >= 0) {
      // Update existing attempt
      updatedUserAttempts = [...gameState.userAttempts];
      updatedUserAttempts[existingAttemptIndex] = newAttempt;
    } else {
      // Add new attempt
      updatedUserAttempts = [...gameState.userAttempts, newAttempt];
    }

    let updatedWinners = gameState.winners;
    if (isCorrect && !gameState.winners.includes(username)) {
      updatedWinners = [...gameState.winners, username];
    }

    return {
      ...gameState,
      userAttempts: updatedUserAttempts,
      winners: updatedWinners,
    };
  }
}
