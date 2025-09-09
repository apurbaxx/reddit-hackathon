import { Celebrity } from '../../shared/types/api';

// Celebrity database with free images from public sources
export const CELEBRITIES: Celebrity[] = [
  {
    id: 'leonardo-dicaprio',
    name: 'Leonardo DiCaprio',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    aliases: ['Leo DiCaprio', 'Leo', 'DiCaprio', 'Leonardo'],
  },
  {
    id: 'brad-pitt',
    name: 'Brad Pitt',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    aliases: ['Brad', 'Pitt'],
  },
  {
    id: 'tom-cruise',
    name: 'Tom Cruise',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    aliases: ['Tom', 'Cruise', 'TC'],
  },
  {
    id: 'will-smith',
    name: 'Will Smith',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    aliases: ['Will', 'Smith', 'Fresh Prince'],
  },
  {
    id: 'jennifer-lawrence',
    name: 'Jennifer Lawrence',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    aliases: ['Jennifer', 'Lawrence', 'J Law', 'JLaw'],
  },
  {
    id: 'ryan-reynolds',
    name: 'Ryan Reynolds',
    imageUrl:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
    aliases: ['Ryan', 'Reynolds', 'Deadpool'],
  },
  {
    id: 'scarlett-johansson',
    name: 'Scarlett Johansson',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108755-2616b612b9c1?w=400&h=400&fit=crop&crop=face',
    aliases: ['Scarlett', 'Johansson', 'ScarJo', 'Black Widow'],
  },
  {
    id: 'robert-downey-jr',
    name: 'Robert Downey Jr',
    imageUrl:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
    aliases: ['Robert Downey Jr', 'RDJ', 'Iron Man', 'Tony Stark', 'Robert Downey'],
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
// In a real implementation, you might pre-generate these or use an image processing service
export function generateBlurredImageUrls(baseImageUrl: string): string[] {
  // These would be URLs to pre-processed images at different blur levels
  // For this demo, we'll use CSS filters in the frontend
  // But here we return the base URL for all levels for now
  return [
    `${baseImageUrl}&blur=50`, // Level 0 - most blurred
    `${baseImageUrl}&blur=25`, // Level 1
    `${baseImageUrl}&blur=10`, // Level 2
    baseImageUrl, // Level 3 - clear
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
