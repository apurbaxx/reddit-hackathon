import { useState, useEffect, useCallback } from 'react';
import {
  InitResponse,
  GameState,
  GameUpdateResponse,
  GuessSubmissionResponse,
  UserEligibilityResponse,
  GAME_TIMING,
} from '../../shared/types/api';

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
  // New guess functionality
  submitGuess: (guess: string) => Promise<void>;
  isSubmittingGuess: boolean;
  userEligibility: {
    canGuess: boolean;
    hasAlreadyWon: boolean;
    timeUntilNextAttempt?: number;
  };
  lastGuessResult?: {
    isCorrect: boolean;
    message?: string;
  };
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

  // New guess functionality state
  const [isSubmittingGuess, setIsSubmittingGuess] = useState<boolean>(false);
  const [userEligibility, setUserEligibility] = useState<{
    canGuess: boolean;
    hasAlreadyWon: boolean;
    timeUntilNextAttempt?: number;
  }>({
    canGuess: false,
    hasAlreadyWon: false,
  });
  const [lastGuessResult, setLastGuessResult] = useState<
    | {
        isCorrect: boolean;
        message?: string;
      }
    | undefined
  >(undefined);

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

  // Check user eligibility for guessing
  const checkUserEligibility = useCallback(async () => {
    try {
      const response = await fetch('/api/user-eligibility');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UserEligibilityResponse = await response.json();

      const eligibilityUpdate: {
        canGuess: boolean;
        hasAlreadyWon: boolean;
        timeUntilNextAttempt?: number;
      } = {
        canGuess: data.canGuess,
        hasAlreadyWon: data.hasAlreadyWon,
      };

      if (data.timeUntilNextAttempt !== undefined) {
        eligibilityUpdate.timeUntilNextAttempt = data.timeUntilNextAttempt;
      }

      setUserEligibility(eligibilityUpdate);
    } catch (err) {
      console.error('Failed to check user eligibility:', err);
    }
  }, []);

  // Submit a guess
  const submitGuess = useCallback(
    async (guess: string) => {
      setIsSubmittingGuess(true);
      setLastGuessResult(undefined);

      try {
        const response = await fetch('/api/submit-guess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, guess }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GuessSubmissionResponse = await response.json();

        const guessResult: {
          isCorrect: boolean;
          message?: string;
        } = {
          isCorrect: data.isCorrect,
        };

        if (data.message !== undefined) {
          guessResult.message = data.message;
        }

        setLastGuessResult(guessResult);

        // Refresh game state and user eligibility after guess
        await Promise.all([refreshGameState(), checkUserEligibility()]);
      } catch (err) {
        console.error('Failed to submit guess:', err);
        setError(err instanceof Error ? err.message : 'Failed to submit guess');
      } finally {
        setIsSubmittingGuess(false);
      }
    },
    [postId, refreshGameState, checkUserEligibility]
  );

  // Initialize on mount
  useEffect(() => {
    void initializeGame();
  }, [initializeGame]);

  // Check user eligibility when game state changes
  useEffect(() => {
    if (gameState && !loading) {
      void checkUserEligibility();
    }
  }, [gameState, loading, checkUserEligibility]);

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
    // New guess functionality
    submitGuess,
    isSubmittingGuess,
    userEligibility,
    ...(lastGuessResult && { lastGuessResult }),
  };
};
