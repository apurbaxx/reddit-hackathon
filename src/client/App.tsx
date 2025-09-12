import { navigateTo } from '@devvit/web/client';
import { useGame } from './hooks/useGame';
import { useDarkMode } from './hooks/useDarkMode';
import { GameDisplay } from './components/GameDisplay';
import { DarkModeToggle } from './components/DarkModeToggle';

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
  } = useGame();

  const { isDarkMode, toggleDarkMode } = useDarkMode();

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
      {/* Reddit-style header */}
      <header className="bg-white border-b border-reddit-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-reddit-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎭</span>
              </div>
              <div>
                <h1 className="text-reddit-text font-bold text-lg">Guess the Celebrity</h1>
                <p className="text-reddit-text-secondary text-xs">r/copyrighted_art_dev</p>
              </div>
            </div>
            <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-4">
        <GameDisplay
          gameState={gameState}
          timeUntilNextReveal={timeUntilNextReveal}
          timeUntilGameEnd={timeUntilGameEnd}
          timeUntilNextGame={timeUntilNextGame}
          username={username}
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
