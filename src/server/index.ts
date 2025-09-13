import express from 'express';
import {
  InitResponse,
  GameUpdateResponse,
  GuessSubmissionResponse,
  UserEligibilityResponse,
  GameState,
} from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import { GameService } from './core/game';
import { isCorrectGuess, getRandomCorrectMessage } from './core/celebrities';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// Helper function to get asset URL - assets will be served directly from client build
const getAssetURL = async (filename: string): Promise<string> => {
  // Assets are copied to the client build directory by Vite, so they're available directly
  return filename;
};

// Helper function to get or create game state
async function getOrCreateGameState(postId: string): Promise<GameState> {
  const gameStateStr = await redis.get(`game:${postId}`);

  if (gameStateStr) {
    const gameState = JSON.parse(gameStateStr) as GameState;
    // Update game state based on current time
    const updatedGameState = await GameService.updateGameState(gameState, getAssetURL);

    // Save updated state if it changed
    if (JSON.stringify(updatedGameState) !== JSON.stringify(gameState)) {
      await redis.set(`game:${postId}`, JSON.stringify(updatedGameState));
    }

    return updatedGameState;
  } else {
    // Create new game
    const newGameState = await GameService.createNewGame(getAssetURL);
    await redis.set(`game:${postId}`, JSON.stringify(newGameState));
    return newGameState;
  }
}

// Initialize game and get current state
router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [gameState, username] = await Promise.all([
        getOrCreateGameState(postId),
        reddit.getCurrentUsername(),
      ]);

      res.json({
        type: 'init',
        postId: postId,
        username: username ?? 'anonymous',
        gameState,
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

// Get updated game state
router.get<{ postId: string }, GameUpdateResponse | { status: string; message: string }>(
  '/api/game-state',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    try {
      const gameState = await getOrCreateGameState(postId);

      res.json({
        type: 'game-update',
        postId,
        gameState,
      });
    } catch (error) {
      console.error(`Game State Error for post ${postId}:`, error);
      res.status(400).json({ status: 'error', message: 'Failed to get game state' });
    }
  }
);

// Check if user can make a guess
router.get<{ postId: string }, UserEligibilityResponse | { status: string; message: string }>(
  '/api/user-eligibility',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    try {
      const [gameState, username] = await Promise.all([
        getOrCreateGameState(postId),
        reddit.getCurrentUsername(),
      ]);

      if (!username) {
        res.status(400).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      const eligibility = GameService.canUserGuess(gameState, username);

      const response: UserEligibilityResponse = {
        type: 'user-eligibility',
        canGuess: eligibility.canGuess,
        hasAlreadyWon: eligibility.hasAlreadyWon,
      };

      if (eligibility.nextAllowedAttemptTime !== undefined) {
        response.nextAllowedAttemptTime = eligibility.nextAllowedAttemptTime;
      }

      if (eligibility.timeUntilNextAttempt !== undefined) {
        response.timeUntilNextAttempt = eligibility.timeUntilNextAttempt;
      }

      res.json(response);
    } catch (error) {
      console.error(`User Eligibility Error for post ${postId}:`, error);
      res.status(400).json({ status: 'error', message: 'Failed to check user eligibility' });
    }
  }
);

// Submit a guess
router.post<
  unknown,
  GuessSubmissionResponse | { status: string; message: string },
  {
    postId: string;
    guess: string;
  }
>('/api/submit-guess', async (req, res): Promise<void> => {
  const { postId, guess } = req.body;

  if (!postId || !guess) {
    res.status(400).json({
      status: 'error',
      message: 'postId and guess are required',
    });
    return;
  }

  try {
    const [gameState, username] = await Promise.all([
      getOrCreateGameState(postId),
      reddit.getCurrentUsername(),
    ]);

    if (!username) {
      res.status(400).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    // Check if user can make a guess
    const eligibility = GameService.canUserGuess(gameState, username);
    if (!eligibility.canGuess) {
      const response: GuessSubmissionResponse = {
        type: 'guess-submission',
        isCorrect: false,
        message: eligibility.hasAlreadyWon
          ? 'You have already guessed correctly!'
          : 'You must wait before guessing again.',
        canGuessAgain: false,
      };

      if (eligibility.nextAllowedAttemptTime !== undefined) {
        response.nextAllowedAttemptTime = eligibility.nextAllowedAttemptTime;
      }

      res.json(response);
      return;
    }

    // Only check guesses if game is active
    if (gameState.gamePhase !== 'active') {
      res.json({
        type: 'guess-submission',
        isCorrect: false,
        message: 'Game has ended',
        canGuessAgain: false,
      });
      return;
    }

    // Check if the guess is correct
    const { CELEBRITIES } = await import('./core/celebrities');
    const celebrity = CELEBRITIES.find((c) => c.name === gameState.celebrityName);
    const isCorrect = celebrity ? isCorrectGuess(guess, celebrity) : false;

    // Record the attempt
    const updatedGameState = GameService.recordUserAttempt(gameState, username, isCorrect);
    await redis.set(`game:${postId}`, JSON.stringify(updatedGameState));

    if (isCorrect) {
      // Get random success message
      const message = getRandomCorrectMessage();

      res.json({
        type: 'guess-submission',
        isCorrect: true,
        message,
        canGuessAgain: false, // User has won, no more guessing needed
      });
    } else {
      res.json({
        type: 'guess-submission',
        isCorrect: false,
        message: 'Not quite right! Try again in 30 minutes.',
        canGuessAgain: false,
        nextAllowedAttemptTime: Date.now() + 30 * 60 * 1000, // 30 minutes from now
      });
    }
  } catch (error) {
    console.error(`Guess Submission Error for post ${postId}:`, error);
    res.status(400).json({ status: 'error', message: 'Failed to submit guess' });
  }
});

// Reset game (for testing)
router.post<unknown, { status: string; message: string } | GameUpdateResponse, { postId: string }>(
  '/api/reset-game',
  async (req, res): Promise<void> => {
    const { postId } = req.body;

    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    try {
      // Create new game
      const newGameState = await GameService.createNewGame(getAssetURL);
      await redis.set(`game:${postId}`, JSON.stringify(newGameState));

      res.json({
        type: 'game-update',
        postId,
        gameState: newGameState,
      });
    } catch (error) {
      console.error(`Reset Game Error for post ${postId}:`, error);
      res.status(400).json({ status: 'error', message: 'Failed to reset game' });
    }
  }
);

// Create new post endpoint
router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
