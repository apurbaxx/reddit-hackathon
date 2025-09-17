import React from 'react';
import { GameState } from '../../shared/types/api';
import { Timer } from './Timer';
import { GuessInput } from './GuessInput';
import { DarkModeToggle } from './DarkModeToggle';
import { useDarkMode } from '../hooks/useDarkMode';

interface GameDisplayProps {
  gameState: GameState;
  timeUntilNextReveal: number;
  timeUntilGameEnd: number;
  timeUntilNextGame: number;
  username: string;
  onSubmitGuess: (guess: string) => Promise<void>;
  isSubmittingGuess: boolean;
  userEligibility: {
    canGuess: boolean;
    hasAlreadyWon: boolean;
  };
  timeUntilNextAttempt: number;
  lastGuessResult?: {
    isCorrect: boolean;
    message?: string;
  };
}

export const GameDisplay: React.FC<GameDisplayProps> = ({
  gameState,
  timeUntilNextReveal,
  timeUntilGameEnd,
  timeUntilNextGame,
  username,
  onSubmitGuess,
  isSubmittingGuess,
  userEligibility,
  timeUntilNextAttempt,
  lastGuessResult,
}) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const getCurrentImageUrl = (): string => {
    return gameState.imageUrl;
  };

  const getBlurAmount = (): number => {
    switch (gameState.currentBlurLevel) {
      case 0:
        return 20;
      case 1:
        return 15;
      case 2:
        return 10;
      case 3:
        return 7;
      default:
        return 20;
    }
  };

  const getRevealText = (): string => {
    switch (gameState.currentBlurLevel) {
      case 0:
        return 'First Clue (Most Blurred)';
      case 1:
        return 'Second Clue (Less Blurred)';
      case 2:
        return 'Third Clue (Getting Clearer)';
      case 3:
        return 'Final Reveal (Lightly Blurred)';
      default:
        return 'Mystery Image';
    }
  };

  const blurStyle = {
    filter: `blur(${getBlurAmount()}px)`,
    transition: 'filter 0.5s ease-in-out',
  };

  return (
    <div className="bg-white border border-reddit-border rounded-md shadow-sm font-mono">
      {/* Reddit-style post header */}
      <div className="flex items-center p-3 border-b border-reddit-border">
        <img src="/snoo.png" alt="Snoo" className="w-8 h-8 mr-3 pixelated" />
        <div className="flex-1">
          <h1 className="text-reddit-text font-medium text-lg">
            Guess the Celeb Challenge!
          </h1>
        </div>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      </div>

      {/* Post content */}
      <div className="p-4">
        {/* Game Status Banner */}
        <div className="bg-reddit-orange-light border-2 border-reddit-orange p-3 mb-4 rounded-md text-center">
          <h2 className="text-reddit-text font-bold text-xl uppercase">{getRevealText()}</h2>
          <p className="text-reddit-text-secondary text-sm">
            {gameState.gamePhase === 'active'
              ? 'Can you identify this celebrity?'
              : 'Game Over! Check out the results.'}
          </p>
        </div>

        {/* Celebrity Image */}
        <div className="flex justify-center mb-6">
          <div className="relative p-2 border-4 border-gray-800 rounded-md reddit-glitch">
            <img
              src={getCurrentImageUrl()}
              alt="Mystery Celebrity"
              className="w-80 h-80 object-cover pixelated"
              style={gameState.gamePhase === 'active' ? blurStyle : {}}
              onError={(e) => {
                e.currentTarget.src = 'snoo.png';
              }}
            />
            {gameState.gamePhase === 'revealed' && (
              <div className="absolute top-2 right-2 bg-reddit-green text-white px-3 py-1 rounded-full text-sm font-bold">
                REVEALED!
              </div>
            )}
          </div>
        </div>

        {/* Timers */}
        {gameState.gamePhase === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {gameState.currentBlurLevel < 3 && (
              <Timer
                milliseconds={timeUntilNextReveal}
                label="Next Clue In:"
                className="bg-reddit-orange-light border border-reddit-orange rounded p-3"
              />
            )}
            <Timer
              milliseconds={timeUntilGameEnd}
              label="Game Ends In:"
              className="bg-reddit-red-light border border-reddit-red rounded p-3"
            />
          </div>
        )}

        {/* Game Over / Results */}
        {gameState.gamePhase === 'revealed' && (
          <div className="bg-green-900 border-4 border-green-500 rounded-lg p-4 mb-6 text-white text-center">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
              🎉 Game Over! 🎉
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                The celebrity was:{' '}
                <span className="text-green-300 font-bold">{gameState.celebrityName}</span>
              </h3>
            </div>

            {gameState.winners.length > 0 ? (
              <div>
                <h4 className="font-semibold mb-3">
                  🏆 Winners ({gameState.winners.length}):
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {gameState.winners.map((winner, index) => (
                    <span
                      key={index}
                      className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium"
                    >
                      u/{winner}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p>🤔 No one guessed correctly this time!</p>
                <p className="text-sm mt-1">Better luck next game!</p>
              </div>
            )}

            {timeUntilNextGame > 0 && (
              <div className="mt-6">
                <div className="bg-blue-900 border-2 border-blue-500 rounded p-3">
                  <h4 className="font-semibold mb-2">
                    🚀 Next Game Starting Soon!
                  </h4>
                  <Timer
                    milliseconds={timeUntilNextGame}
                    label="New game in:"
                    className="text-blue-300"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guess Input Component */}
        {gameState.gamePhase === 'active' && (
          <div className="mb-8">
            <GuessInput
              onSubmitGuess={onSubmitGuess}
              isSubmitting={isSubmittingGuess}
              canGuess={userEligibility.canGuess}
              hasAlreadyWon={userEligibility.hasAlreadyWon}
              timeUntilNextAttempt={timeUntilNextAttempt}
              gamePhase={gameState.gamePhase}
              {...(lastGuessResult && { lastGuessResult })}
            />
          </div>
        )}

        {/* Instructions Card */}
        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <span>📋</span> How to Play:
          </h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>Look at the pixelated image above.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>Submit your guess in the comments.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>The image gets clearer every 30 mins.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>30-min cooldown on wrong guesses.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>Full reveal after 2 hours. Good luck!</span>
            </li>
          </ul>
          {username && (
            <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded text-sm">
              <span className="text-gray-400">Playing as:</span>{' '}
              <span className="font-medium text-reddit-orange">u/{username}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
