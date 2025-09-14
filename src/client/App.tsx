import { navigateTo } from '@devvit/web/client';
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
    return (
      <div className="min-h-screen bg-reddit-bg">
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-reddit-orange"></div>
          <p className="mt-4 text-reddit-text-secondary">Loading game...</p>
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

      {/* Reddit-style footer */}
      <footer className="border-t border-reddit-border bg-white py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex justify-center gap-6 text-xs text-reddit-text-secondary">
          <button
            className="hover:text-reddit-orange transition-colors"
            onClick={() => navigateTo('https://developers.reddit.com/docs')}
          >
            Devvit Docs
          </button>
          <span>•</span>
          <button
            className="hover:text-reddit-orange transition-colors"
            onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
          >
            r/Devvit
          </button>
          <span>•</span>
          <button className="hover:text-reddit-orange transition-colors" onClick={refreshGameState}>
            Refresh Game
          </button>
          <span>•</span>
          <button className="hover:text-reddit-red transition-colors" onClick={resetGame}>
            🔄 Reset Game (Dev)
          </button>
        </div>
      </footer>
    </div>
  );
};
