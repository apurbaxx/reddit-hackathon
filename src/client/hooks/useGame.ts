import { useState, useEffect, useCallback } from 'react';
import { InitResponse, GameState, GameUpdateResponse, GAME_TIMING } from '../../shared/types/api';

export interface UseGameResult {
  gameState: GameState | null;
  username: string;
  loading: boolean;
  error: string | null;
  timeUntilNextReveal: number;
  timeUntilGameEnd: number;
  timeUntilNextGame: number;
  refreshGameState: () => void;
  resetGame: () => void;
}

export const useGame = (): UseGameResult => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [username, setUsername] = useState<string>('');
  const [postId, setPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilNextReveal, setTimeUntilNextReveal] = useState<number>(0);
  const [timeUntilGameEnd, setTimeUntilGameEnd] = useState<number>(0);
  const [timeUntilNextGame, setTimeUntilNextGame] = useState<number>(0);

  // Calculate time remaining
  const updateTimers = useCallback((state: GameState) => {
    const now = Date.now();

    // Time until next reveal
    const nextRevealTime = Math.max(0, state.nextRevealTime - now);
    setTimeUntilNextReveal(nextRevealTime);

    // Time until game ends (using shared constant)
    const gameEndTime = state.startTime + GAME_TIMING.TOTAL_GAME_DURATION;
    const timeUntilEnd = Math.max(0, gameEndTime - now);
    setTimeUntilGameEnd(timeUntilEnd);

    // Time until next game starts (if current game is over)
    if (state.isGameOver) {
      const nextGameStartTime = gameEndTime + GAME_TIMING.GAME_RESTART_DELAY;
      const timeUntilNext = Math.max(0, nextGameStartTime - now);
      setTimeUntilNextGame(timeUntilNext);
    } else {
      setTimeUntilNextGame(0);
    }
  }, []);

  // Initialize game
  const initializeGame = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/init');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: InitResponse = await response.json();

      setGameState(data.gameState);
      setUsername(data.username);
      setPostId(data.postId); // Store the postId for use in reset
      updateTimers(data.gameState);
    } catch (err) {
      console.error('Failed to initialize game:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize game');
    } finally {
      setLoading(false);
    }
  }, [updateTimers]);

  // Refresh game state
  const refreshGameState = useCallback(async () => {
    if (!postId) return;

    try {
      const response = await fetch('/api/game-state');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GameUpdateResponse = await response.json();

      setGameState(data.gameState);
      updateTimers(data.gameState);
    } catch (err) {
      console.error('Failed to refresh game state:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh game state');
    }
  }, [postId, updateTimers]);

  // Reset game (for development/testing)
  const resetGame = useCallback(async () => {
    if (!gameState || !postId) return;

    try {
      setLoading(true);
      const response = await fetch('/api/reset-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }), // Use the actual postId from initialization
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GameUpdateResponse = await response.json();

      setGameState(data.gameState);
      updateTimers(data.gameState);
      setError(null);
    } catch (err) {
      console.error('Failed to reset game:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset game');
    } finally {
      setLoading(false);
    }
  }, [gameState, postId, updateTimers]);

  // Initialize on mount
  useEffect(() => {
    void initializeGame();
  }, [initializeGame]);

  // Update timers every second
  useEffect(() => {
    if (!gameState) return;

    const interval = setInterval(() => {
      updateTimers(gameState);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, updateTimers]);

  // Auto-refresh game state - more frequent when game is over to catch new game
  useEffect(() => {
    if (!gameState || loading) return;

    // Refresh more frequently (every 10 seconds) when game is over to catch new game
    const refreshInterval = gameState.isGameOver ? 10000 : 30000;

    const interval = setInterval(() => {
      void refreshGameState();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [gameState, loading, refreshGameState]);

  return {
    gameState,
    username,
    loading,
    error,
    timeUntilNextReveal,
    timeUntilGameEnd,
    timeUntilNextGame,
    refreshGameState,
    resetGame,
  };
};
