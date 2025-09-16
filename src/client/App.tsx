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
    const loadingMessages = [
      'Gathering the most mysterious celebrities from the Reddit multiverse...',
      'Consulting the hivemind for the perfect celebrity mystery...',
      'Deploying upvote-powered image blur technology...',
      'Synchronizing with r/mystery_frame_dev community guidelines...',
      'Loading premium Reddit detective mode...',
    ];

    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    return (
      <div className="min-h-screen bg-gray-900">
        <div className="flex flex-col justify-center items-center min-h-screen p-6">
          {/* Dark themed loading card */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md text-center shadow-lg">
            {/* Modern spinning wheel */}
            <div className="mb-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-reddit-orange"></div>
            </div>

            {/* Loading text */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Loading Your Game...</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{randomMessage}</p>

              {/* Simple Reddit branding */}
              <div className="flex justify-center items-center gap-2 pt-4 border-t border-gray-700">
                <div className="w-5 h-5 bg-reddit-orange rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">r/</span>
                </div>
                <span className="text-gray-400 text-sm">mystery_frame_dev</span>
              </div>
            </div>
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
