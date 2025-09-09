import express from 'express';
import {
  InitResponse,
  GameUpdateResponse,
  CommentCheckResponse,
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

// Helper function to get or create game state
async function getOrCreateGameState(postId: string): Promise<GameState> {
  const gameStateStr = await redis.get(`game:${postId}`);

  if (gameStateStr) {
    const gameState = JSON.parse(gameStateStr) as GameState;
    // Update game state based on current time
    const updatedGameState = GameService.updateGameState(gameState);

    // Save updated state if it changed
    if (JSON.stringify(updatedGameState) !== JSON.stringify(gameState)) {
      await redis.set(`game:${postId}`, JSON.stringify(updatedGameState));
    }

    return updatedGameState;
  } else {
    // Create new game
    const newGameState = GameService.createNewGame();
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

// Handle comment checking (this would be called by Reddit's comment trigger)
router.post<
  unknown,
  CommentCheckResponse | { status: string; message: string },
  {
    postId: string;
    comment: string;
    username: string;
  }
>('/api/check-comment', async (req, res): Promise<void> => {
  const { postId, comment, username } = req.body;

  if (!postId || !comment || !username) {
    res.status(400).json({
      status: 'error',
      message: 'postId, comment, and username are required',
    });
    return;
  }

  try {
    const gameState = await getOrCreateGameState(postId);

    // Only check comments if game is active
    if (gameState.gamePhase !== 'active') {
      res.json({
        type: 'comment-check',
        isCorrect: false,
        message: 'Game has ended',
      });
      return;
    }

    // Check if the guess is correct
    // We need to find the celebrity object to do proper matching
    const { CELEBRITIES } = await import('./core/celebrities');
    const celebrity = CELEBRITIES.find((c) => c.name === gameState.celebrityName);
    const isCorrect = celebrity ? isCorrectGuess(comment, celebrity) : false;

    if (isCorrect) {
      // Add winner to game state
      const updatedGameState = GameService.addWinner(gameState, username);
      await redis.set(`game:${postId}`, JSON.stringify(updatedGameState));

      // Get random success message
      const message = getRandomCorrectMessage();

      res.json({
        type: 'comment-check',
        isCorrect: true,
        message,
      });
    } else {
      res.json({
        type: 'comment-check',
        isCorrect: false,
      });
    }
  } catch (error) {
    console.error(`Comment Check Error for post ${postId}:`, error);
    res.status(400).json({ status: 'error', message: 'Failed to check comment' });
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
      const newGameState = GameService.createNewGame();
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
