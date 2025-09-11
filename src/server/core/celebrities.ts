import { Celebrity } from '../../shared/types/api';

// Celebrity database with image asset names
export const CELEBRITIES: Celebrity[] = [
  {
    id: 'leonardo-dicaprio',
    name: 'Leonardo DiCaprio',
    imageUrl: 'leonardo-dicaprio.jpg',
    aliases: ['Leo DiCaprio', 'Leo', 'DiCaprio', 'Leonardo'],
  },
  {
    id: 'brad-pitt',
    name: 'Brad Pitt',
    imageUrl: 'brad-pitt.jpg',
    aliases: ['Brad', 'Pitt'],
  },
  {
    id: 'tom-cruise',
    name: 'Tom Cruise',
    imageUrl: 'tom-cruise.jpg',
    aliases: ['Tom', 'Cruise', 'TC'],
  },
  {
    id: 'will-smith',
    name: 'Will Smith',
    imageUrl: 'will-smith.jpg',
    aliases: ['Will', 'Smith', 'Fresh Prince'],
  },
  {
    id: 'jennifer-lawrence',
    name: 'Jennifer Lawrence',
    imageUrl: 'jennifer-lawrence.jpg',
    aliases: ['Jennifer', 'Lawrence', 'J Law', 'JLaw'],
  },
  {
    id: 'ryan-reynolds',
    name: 'Ryan Reynolds',
    imageUrl: 'ryan-reynolds.jpg',
    aliases: ['Ryan', 'Reynolds', 'Deadpool'],
  },
  {
    id: 'scarlett-johansson',
    name: 'Scarlett Johansson',
    imageUrl: 'scarlett-johansson.jpg',
    aliases: ['Scarlett', 'Johansson', 'ScarJo', 'Black Widow'],
  },
  {
    id: 'robert-downey-jr',
    name: 'Robert Downey Jr',
    imageUrl: 'robert-downey-jr.jpg',
    aliases: ['Robert Downey Jr', 'RDJ', 'Iron Man', 'Tony Stark', 'Robert Downey'],
  },
  {
    id: 'emma-stone',
    name: 'Emma Stone',
    imageUrl: 'emma-stone.jpg',
    aliases: ['Emma', 'Stone'],
  },
  {
    id: 'chris-evans',
    name: 'Chris Evans',
    imageUrl: 'chris-evans.jpg',
    aliases: ['Chris', 'Evans', 'Captain America', 'Steve Rogers'],
  },
  {
    id: 'margot-robbie',
    name: 'Margot Robbie',
    imageUrl: 'margot-robbie.jpg',
    aliases: ['Margot', 'Robbie', 'Harley Quinn'],
  },
];

// Function to get a random celebrity
export function getRandomCelebrity(): Celebrity {
  const randomIndex = Math.floor(Math.random() * CELEBRITIES.length);
  return CELEBRITIES[randomIndex]!;
}

// Function to get celebrity by ID
export function getCelebrityById(id: string): Celebrity | undefined {
  return CELEBRITIES.find((celeb) => celeb.id === id);
}

// Function to generate blurred image URLs using a CSS filter approach
// The frontend will apply CSS blur filters, so we just return the base URL
export function generateBlurredImageUrls(baseImageUrl: string): string[] {
  // Return the same base URL for all levels since CSS handles the blur effect
  // This ensures the same image is used consistently across all blur levels
  return [
    baseImageUrl, // Level 0 - will be blurred with CSS
    baseImageUrl, // Level 1 - will be blurred with CSS
    baseImageUrl, // Level 2 - will be blurred with CSS
    baseImageUrl, // Level 3 - clear (no CSS blur)
  ];
}

// Function to check if a guess matches the celebrity name (fuzzy matching)
export function isCorrectGuess(guess: string, celebrity: Celebrity): boolean {
  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedName = celebrity.name.toLowerCase();

  // Direct name match
  if (normalizedName.includes(normalizedGuess) || normalizedGuess.includes(normalizedName)) {
    return true;
  }

  // Check aliases
  if (celebrity.aliases) {
    for (const alias of celebrity.aliases) {
      const normalizedAlias = alias.toLowerCase();
      if (normalizedAlias.includes(normalizedGuess) || normalizedGuess.includes(normalizedAlias)) {
        return true;
      }
    }
  }

  // Check individual words (for names like "Tom Cruise" matching "Cruise")
  const nameWords = normalizedName.split(' ');
  const guessWords = normalizedGuess.split(' ');

  for (const nameWord of nameWords) {
    for (const guessWord of guessWords) {
      if (nameWord === guessWord && guessWord.length > 2) {
        // Avoid matching very short words
        return true;
      }
    }
  }

  return false;
}

// Fun response messages for correct guesses
export const CORRECT_GUESS_MESSAGES = [
  '🧠 W Einstein moment, you guessed it right!',
  '🎯 Bullseye! You nailed it!',
  "🔥 That's absolutely right! You're on fire!",
  '⭐ Stellar guess! You got it!',
  '🎉 Bingo! Correct answer!',
  '🏆 Champion guess! Well done!',
  '💡 Brilliant! You figured it out!',
  '🎊 Perfect! You cracked the code!',
  '🌟 Amazing! Right on the money!',
  '🚀 Fantastic guess! To the moon!',
];

export function getRandomCorrectMessage(): string {
  const randomIndex = Math.floor(Math.random() * CORRECT_GUESS_MESSAGES.length);
  return CORRECT_GUESS_MESSAGES[randomIndex]!;
}
