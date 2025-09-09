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
    refreshGameState,
  } = useGame();

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading game...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshGameState}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No game state
  if (!gameState) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No game available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GameDisplay
        gameState={gameState}
        timeUntilNextReveal={timeUntilNextReveal}
        timeUntilGameEnd={timeUntilGameEnd}
        username={username}
      />

      {/* Footer */}
      <footer className="border-t bg-white py-6 mt-8">
        <div className="max-w-2xl mx-auto px-6 flex justify-center gap-6 text-sm text-gray-500">
          <button
            className="hover:text-blue-600 transition-colors"
            onClick={() => navigateTo('https://developers.reddit.com/docs')}
          >
            Devvit Docs
          </button>
          <span>|</span>
          <button
            className="hover:text-blue-600 transition-colors"
            onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
          >
            r/Devvit
          </button>
          <span>|</span>
          <button className="hover:text-blue-600 transition-colors" onClick={refreshGameState}>
            Refresh Game
          </button>
        </div>
      </footer>
    </div>
  );
};
