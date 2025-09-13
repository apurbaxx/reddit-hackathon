import React, { useState, useEffect } from 'react';
import { Timer } from './Timer';

interface GuessInputProps {
  onSubmitGuess: (guess: string) => Promise<void>;
  isSubmitting: boolean;
  canGuess: boolean;
  hasAlreadyWon: boolean;
  timeUntilNextAttempt?: number;
  gamePhase: 'active' | 'revealed';
  lastGuessResult?: {
    isCorrect: boolean;
    message?: string;
  };
}

export const GuessInput: React.FC<GuessInputProps> = ({
  onSubmitGuess,
  isSubmitting,
  canGuess,
  hasAlreadyWon,
  timeUntilNextAttempt,
  gamePhase,
  lastGuessResult,
}) => {
  const [guess, setGuess] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Show result when there's a new guess result
  useEffect(() => {
    if (lastGuessResult) {
      setShowResult(true);
      // Hide result after 5 seconds if it's an incorrect guess
      if (!lastGuessResult.isCorrect) {
        const timer = setTimeout(() => setShowResult(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [lastGuessResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || isSubmitting || !canGuess) return;

    await onSubmitGuess(guess.trim());
    setGuess(''); // Clear input after submission
  };

  // Game is over
  if (gamePhase === 'revealed') {
    return (
      <div className="bg-reddit-bg border border-reddit-border rounded p-4">
        <div className="text-center text-reddit-text-secondary">
          <h3 className="font-semibold text-reddit-text mb-2">🏁 Game Complete!</h3>
          <p>The game has ended. Check out the results above!</p>
        </div>
      </div>
    );
  }

  // User has already won
  if (hasAlreadyWon) {
    return (
      <div className="bg-reddit-green-light border border-reddit-green rounded p-4">
        <div className="text-center">
          <h3 className="font-semibold text-reddit-green-dark mb-2">🎉 Congratulations!</h3>
          <p className="text-reddit-text">You've already guessed correctly this round!</p>
          <p className="text-reddit-text-secondary text-sm mt-1">
            Wait for the next game to play again.
          </p>
        </div>
      </div>
    );
  }

  // User is on cooldown
  if (!canGuess && timeUntilNextAttempt && timeUntilNextAttempt > 0) {
    return (
      <div className="bg-reddit-orange-light border border-reddit-orange rounded p-4">
        <div className="text-center">
          <h3 className="font-semibold text-reddit-orange-dark mb-2">⏰ Cooldown Active</h3>
          <p className="text-reddit-text mb-3">
            You made an incorrect guess. Try again when the cooldown ends!
          </p>
          <Timer
            milliseconds={timeUntilNextAttempt}
            label="Next attempt in:"
            className="bg-white border border-reddit-orange rounded p-2"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-reddit-border rounded p-4">
      <h3 className="font-semibold text-reddit-text mb-3 flex items-center gap-2">
        <span>🤔</span> Make Your Guess:
      </h3>

      {/* Success/Error Message */}
      {showResult && lastGuessResult && (
        <div
          className={`mb-4 p-3 rounded border-l-4 ${
            lastGuessResult.isCorrect
              ? 'bg-reddit-green-light border-reddit-green'
              : 'bg-reddit-red-light border-reddit-red'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{lastGuessResult.isCorrect ? '🎉' : '❌'}</span>
            <div>
              <p
                className={`font-semibold ${
                  lastGuessResult.isCorrect ? 'text-reddit-green-dark' : 'text-reddit-red-dark'
                }`}
              >
                {lastGuessResult.isCorrect ? 'Correct!' : 'Incorrect!'}
              </p>
              {lastGuessResult.message && (
                <p className="text-reddit-text text-sm mt-1">{lastGuessResult.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter celebrity name..."
            className="w-full px-3 py-2 border border-reddit-border rounded-md focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:border-transparent"
            disabled={isSubmitting || !canGuess}
            maxLength={100}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={!guess.trim() || isSubmitting || !canGuess}
            className="bg-reddit-orange text-white px-6 py-2 rounded-full hover:bg-reddit-orange-dark transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <span>🎯</span>
                Submit Guess
              </>
            )}
          </button>

          <div className="text-reddit-text-secondary text-xs">{guess.length}/100 characters</div>
        </div>
      </form>

      <div className="mt-4 p-3 bg-reddit-bg rounded text-sm text-reddit-text-secondary">
        <p className="flex items-center gap-2">
          <span>💡</span>
          <span>
            <strong>Tip:</strong> Try full names, nicknames, or stage names. You get one guess every
            30 minutes!
          </span>
        </p>
      </div>
    </div>
  );
};
