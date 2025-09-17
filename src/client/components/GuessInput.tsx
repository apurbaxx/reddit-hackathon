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

  useEffect(() => {
    if (lastGuessResult) {
      setShowResult(true);
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
    setGuess('');
  };

  if (gamePhase === 'revealed') {
    return null; // Hide input when game is over
  }

  if (hasAlreadyWon) {
    return (
      <div className="bg-green-900 border-4 border-green-500 rounded-lg p-4 text-center text-white">
        <h3 className="font-bold text-xl uppercase mb-2">🎉 You Won! 🎉</h3>
        <p>You've already guessed correctly. Come back for the next game!</p>
      </div>
    );
  }

  if (!canGuess && timeUntilNextAttempt && timeUntilNextAttempt > 0) {
    return (
      <div className="bg-red-900 border-4 border-red-500 rounded-lg p-4 text-center text-white">
        <h3 className="font-bold text-xl uppercase mb-2">⏰ Cooldown!</h3>
        <p className="mb-3">Incorrect guess. Please wait for the timer to end.</p>
        <Timer
          milliseconds={timeUntilNextAttempt}
          label="Next attempt in:"
          className="text-red-300"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 font-mono">
      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
        <span>🤔</span> Make Your Guess:
      </h3>

      {showResult && lastGuessResult && (
        <div
          className={`mb-4 p-3 rounded border-l-4 ${
            lastGuessResult.isCorrect
              ? 'bg-green-900 border-green-500'
              : 'bg-red-900 border-red-500'
          }`}
        >
          <div className="flex items-center gap-2 text-white">
            <span className="text-lg">{lastGuessResult.isCorrect ? '🎉' : '❌'}</span>
            <div>
              <p className="font-bold">
                {lastGuessResult.isCorrect ? 'Correct!' : 'Incorrect!'}
              </p>
              {lastGuessResult.message && (
                <p className="text-sm mt-1">{lastGuessResult.message}</p>
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
            className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:border-transparent font-mono pixelated"
            disabled={isSubmitting || !canGuess}
            maxLength={100}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={!guess.trim() || isSubmitting || !canGuess}
            className="bg-reddit-orange text-white px-6 py-2 rounded-md hover:bg-reddit-orange-dark transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 pixelated-button"
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

          <div className="text-gray-400 text-xs">{guess.length}/100</div>
        </div>
      </form>

      <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded text-sm text-gray-400">
        <p className="flex items-center gap-2">
          <span>💡</span>
          <span>
            <strong>Tip:</strong> Nicknames and partial names might work. Good luck!
          </span>
        </p>
      </div>
    </div>
  );
};
