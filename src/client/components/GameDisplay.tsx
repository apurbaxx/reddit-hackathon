import React from 'react';
import { GameState } from '../../shared/types/api';
import { Timer } from './Timer';

interface GameDisplayProps {
  gameState: GameState;
  timeUntilNextReveal: number;
  timeUntilGameEnd: number;
  timeUntilNextGame: number;
  username: string;
}

export const GameDisplay: React.FC<GameDisplayProps> = ({
  gameState,
  timeUntilNextReveal,
  timeUntilGameEnd,
  timeUntilNextGame,
  username,
}) => {
  const getCurrentImageUrl = (): string => {
    // Use the image URL provided by the server, which should be properly resolved
    console.log('getCurrentImageUrl called with gameState.imageUrl:', gameState.imageUrl);
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
    <div className="bg-white border border-reddit-border rounded-md shadow-sm">
      {/* Reddit-style post header */}
      <div className="flex items-start p-3 border-b border-reddit-border">
        <div className="flex flex-col items-center mr-3">
          {/* Upvote/Downvote arrows */}
          <button className="text-reddit-text-secondary hover:text-reddit-orange p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="text-reddit-text font-bold text-sm py-1">🎭</span>
          <button className="text-reddit-text-secondary hover:text-reddit-blue p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1">
          <h1 className="text-reddit-text font-medium text-lg mb-2">
            🎭 Guess the Celebrity - {getRevealText()}
          </h1>
        </div>
      </div>

      {/* Post content */}
      <div className="p-4">
        {/* Game Status Banner */}
        <div className="bg-reddit-orange-light border-l-4 border-reddit-orange p-3 mb-4 rounded-r">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-reddit-text font-semibold">{getRevealText()}</h2>
              <p className="text-reddit-text-secondary text-sm">
                {gameState.gamePhase === 'active'
                  ? 'Submit your guess in the comments below!'
                  : 'Game Over! See the results below.'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-reddit-orange font-bold text-lg">
                {gameState.currentBlurLevel + 1}/4
              </div>
              <div className="text-reddit-text-secondary text-xs">Blur Level</div>
            </div>
          </div>
        </div>

        {/* Celebrity Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={getCurrentImageUrl()}
              alt="Mystery Celebrity"
              className="w-80 h-80 object-cover rounded-md border border-reddit-border"
              style={gameState.gamePhase === 'active' ? blurStyle : {}}
              onError={(e) => {
                console.error('Image failed to load:', getCurrentImageUrl());
                console.error('Original gameState.imageUrl:', gameState.imageUrl);

                // If the image fails to load, fall back to snoo.png
                console.log('Image failed to load, using snoo.png fallback');
                e.currentTarget.src = 'snoo.png';
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', getCurrentImageUrl());
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
          <div className="bg-reddit-green-light border border-reddit-green rounded p-4 mb-6">
            <h2 className="text-xl font-bold text-reddit-green-dark text-center mb-4">
              🎉 Game Complete!
            </h2>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-reddit-text">
                The celebrity was:{' '}
                <span className="text-reddit-green-dark font-bold">{gameState.celebrityName}</span>
              </h3>
            </div>

            {gameState.winners.length > 0 ? (
              <div className="text-center">
                <h4 className="text-reddit-text font-semibold mb-3">
                  🏆 Winners ({gameState.winners.length}):
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {gameState.winners.map((winner, index) => (
                    <span
                      key={index}
                      className="bg-reddit-orange text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-reddit-orange-dark cursor-pointer"
                    >
                      u/{winner}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-reddit-text-secondary">
                <p>🤔 No one guessed correctly this time!</p>
                <p className="text-sm mt-1">Better luck next game!</p>
              </div>
            )}

            {/* Next Game Countdown */}
            {timeUntilNextGame > 0 && (
              <div className="mt-6 text-center">
                <div className="bg-reddit-blue-light border border-reddit-blue rounded p-3">
                  <h4 className="text-reddit-blue-dark font-semibold mb-2">
                    🚀 Next Game Starting Soon!
                  </h4>
                  <Timer
                    milliseconds={timeUntilNextGame}
                    label="New game starts in:"
                    className="text-reddit-blue-dark"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions Card */}
        <div className="bg-reddit-bg border border-reddit-border rounded p-4">
          <h3 className="font-semibold text-reddit-text mb-3 flex items-center gap-2">
            <span>📋</span> How to Play:
          </h3>
          <ul className="text-sm text-reddit-text-secondary space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>Look at the blurred image above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>Submit your guess as a comment below</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>Every 2 hours, the image becomes less blurred</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>Correct guesses get a fun reply from the bot</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-reddit-orange">•</span>
              <span>Game ends after 6 hours with full reveal</span>
            </li>
          </ul>
          {username && (
            <div className="mt-4 p-3 bg-white border border-reddit-border rounded text-sm">
              <span className="text-reddit-text-secondary">Playing as:</span>{' '}
              <span className="font-medium text-reddit-orange">u/{username}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
