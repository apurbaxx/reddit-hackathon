import { GameState } from '../../shared/types/api';
import { getRandomCelebrity, generateBlurredImageUrls } from './celebrities';

const BLUR_REVEAL_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const TOTAL_GAME_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export class GameService {
  // Create a new game
  static createNewGame(): GameState {
    const celebrity = getRandomCelebrity();
    const startTime = Date.now();
    const blurredImages = generateBlurredImageUrls(celebrity.imageUrl);

    return {
      celebrityName: celebrity.name,
      currentBlurLevel: 0, // Start with most blurred
      gamePhase: 'active',
      startTime,
      nextRevealTime: startTime + BLUR_REVEAL_INTERVAL,
      winners: [],
      isGameOver: false,
      imageUrl: celebrity.imageUrl,
      blurredImages,
    };
  }

  // Update game state based on current time
  static updateGameState(gameState: GameState): GameState {
    const currentTime = Date.now();
    const elapsedTime = currentTime - gameState.startTime;

    // If game is already over, don't update
    if (gameState.isGameOver) {
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
