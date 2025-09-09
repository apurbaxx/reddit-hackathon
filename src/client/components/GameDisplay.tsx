import React from 'react';
import { GameState } from '../../shared/types/api';
import { Timer } from './Timer';

interface GameDisplayProps {
  gameState: GameState;
  timeUntilNextReveal: number;
  timeUntilGameEnd: number;
  username: string;
}

export const GameDisplay: React.FC<GameDisplayProps> = ({
  gameState,
  timeUntilNextReveal,
  timeUntilGameEnd,
  username,
}) => {
  const getCurrentImageUrl = (): string => {
    // Since we can't actually blur images server-side with the free APIs,
    // we'll use CSS blur filter on the client side
    return gameState.imageUrl;
  };

  const getBlurAmount = (): number => {
    // Return blur amount based on current level
    // Level 0 = 20px blur, Level 1 = 15px, Level 2 = 10px, Level 3 = 0px
    switch (gameState.currentBlurLevel) {
      case 0:
        return 20;
      case 1:
        return 15;
      case 2:
        return 10;
      case 3:
        return 0;
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
        return 'Final Reveal (Clear Image)';
      default:
        return 'Mystery Image';
    }
  };

  const blurStyle = {
    filter: `blur(${getBlurAmount()}px)`,
    transition: 'filter 0.5s ease-in-out',
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guess the Celebrity!</h1>
        <p className="text-gray-600">
          {gameState.gamePhase === 'active'
            ? 'Submit your guess in the comments below!'
            : 'Game Over! See the results below.'}
        </p>
      </div>

      {/* Game Status */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">{getRevealText()}</h2>
          <div className="text-sm text-blue-700">
            Blur Level: {gameState.currentBlurLevel + 1} of 4
          </div>
        </div>
      </div>

      {/* Celebrity Image */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img
            src={getCurrentImageUrl()}
            alt="Mystery Celebrity"
            className="w-80 h-80 object-cover rounded-lg shadow-lg"
            style={gameState.gamePhase === 'active' ? blurStyle : {}}
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.currentTarget.src = '/snoo.png';
            }}
          />
          {gameState.gamePhase === 'revealed' && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
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
              className="bg-orange-50 p-4 rounded-lg"
            />
          )}
          <Timer
            milliseconds={timeUntilGameEnd}
            label="Game Ends In:"
            className="bg-red-50 p-4 rounded-lg"
          />
        </div>
      )}

      {/* Game Over / Results */}
      {gameState.gamePhase === 'revealed' && (
        <div className="bg-green-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-green-800 text-center mb-4">🎉 Game Complete!</h2>
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-green-700">
              The celebrity was: <span className="text-green-900">{gameState.celebrityName}</span>
            </h3>
          </div>

          {gameState.winners.length > 0 ? (
            <div className="text-center">
              <h4 className="text-lg font-semibold text-green-700 mb-2">
                🏆 Winners ({gameState.winners.length}):
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {gameState.winners.map((winner, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    u/{winner}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-green-700">
              <p>🤔 No one guessed correctly this time!</p>
              <p className="text-sm mt-1">Better luck next game!</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How to Play:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Look at the blurred image above</li>
          <li>• Submit your guess as a comment below</li>
          <li>• Every 2 hours, the image becomes less blurred</li>
          <li>• Correct guesses get a fun reply from the bot</li>
          <li>• Game ends after 6 hours with full reveal</li>
        </ul>
        {username && (
          <div className="mt-3 text-sm text-blue-600">
            Playing as: <span className="font-medium">u/{username}</span>
          </div>
        )}
      </div>
    </div>
  );
};
