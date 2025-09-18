import { useGame } from './hooks/useGame';
import { GameDisplay } from './components/GameDisplay';

export const App = () => {
  const {
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
    timeUntilNextAttempt,
    lastGuessResult,
  } = useGame();

  // Loading state
  if (loading) {
    const loadingMessages = [
      'Reticulating splines...',
      'Calibrating the Reddit hivemind...',
      'Applying extra blur...',
      'Charging up the upvotes...',
      'Definitely not looking at cat pictures...',
    ];

    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6">
        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-8 max-w-md text-center shadow-lg reddit-glitch">
          <div className="mb-6 flex justify-center">
            <img src="/celebGame.png" alt="Loading..." className="w-32 h-32 pixelated snoo-pulse" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Loading Game</h2>
            <p className="text-gray-400 text-sm font-mono">{randomMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-reddit-bg">
        <div className="flex flex-col justify-center items-center min-h-screen p-6">
          <div className="bg-white border border-reddit-border rounded-md p-6 max-w-md text-center shadow-sm">
            <h2 className="text-lg font-semibold text-reddit-text mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-reddit-text-secondary mb-4">{error}</p>
            <button
              onClick={refreshGameState}
              className="bg-reddit-orange text-white px-4 py-2 rounded-full hover:bg-reddit-orange-dark transition-colors font-bold text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No game state
  if (!gameState) {
    return (
      <div className="min-h-screen bg-reddit-bg">
        <div className="flex flex-col justify-center items-center min-h-screen">
          <p className="text-reddit-text-secondary">No game available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-reddit-bg">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <GameDisplay
          gameState={gameState}
          timeUntilNextReveal={timeUntilNextReveal}
          timeUntilGameEnd={timeUntilGameEnd}
          timeUntilNextGame={timeUntilNextGame}
          username={username}
          onSubmitGuess={submitGuess}
          isSubmittingGuess={isSubmittingGuess}
          userEligibility={userEligibility}
          timeUntilNextAttempt={timeUntilNextAttempt}
          {...(lastGuessResult && { lastGuessResult })}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-reddit-border bg-white py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex justify-center text-xs text-reddit-text-secondary">
          <button className="hover:text-reddit-red transition-colors" onClick={resetGame}>
            🔄 Reset Game (Dev)
          </button>
        </div>
      </footer>
    </div>
  );
};
