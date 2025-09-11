import { GameState } from '../../shared/types/api';
import { getRandomCelebrity, generateBlurredImageUrls } from './celebrities';

const BLUR_REVEAL_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const TOTAL_GAME_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
const GAME_RESTART_DELAY = 5 * 60 * 1000; // 5 minutes delay before new game starts

export class GameService {
  // Create a new game
  static async createNewGame(getAssetURL?: (filename: string) => Promise<string>): Promise<GameState> {
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
    };
  }

  // Update game state based on current time
  static async updateGameState(gameState: GameState, getAssetURL?: (filename: string) => Promise<string>): Promise<GameState> {
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
    const newBlurLevel = Math.min(intervals, 3); // Max level is 3 (clear image)

    // Check if game should be over (6 hours passed)
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
}
