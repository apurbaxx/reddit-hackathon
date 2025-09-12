import { Celebrity } from '../../shared/types/api';

// Celebrity database with image asset names
export const CELEBRITIES: Celebrity[] = [
  // Actors
  {
    id: 'leonardo-dicaprio',
    name: 'Leonardo DiCaprio',
    imageUrl: 'leonardoDicaprio.jpg',
    aliases: ['Leo DiCaprio', 'Leo', 'DiCaprio', 'Leonardo'],
  },
  {
    id: 'brad-pitt',
    name: 'Brad Pitt',
    imageUrl: 'braddPit.jpg',
    aliases: ['Brad', 'Pitt'],
  },
  {
    id: 'tom-cruise',
    name: 'Tom Cruise',
    imageUrl: 'tomCruise.jpg',
    aliases: ['Tom', 'Cruise', 'TC'],
  },
  {
    id: 'will-smith',
    name: 'Will Smith',
    imageUrl: 'willSmith.jpg',
    aliases: ['Will', 'Smith', 'Fresh Prince'],
  },
  {
    id: 'jennifer-lawrence',
    name: 'Jennifer Lawrence',
    imageUrl: 'jenniferLawrence.jpg',
    aliases: ['Jennifer', 'Lawrence', 'J Law', 'JLaw'],
  },
  {
    id: 'ryan-reynolds',
    name: 'Ryan Reynolds',
    imageUrl: 'ryanReynolds.jpg',
    aliases: ['Ryan', 'Reynolds', 'Deadpool'],
  },
  {
    id: 'scarlett-johansson',
    name: 'Scarlett Johansson',
    imageUrl: 'scarlettJohansson.jpg',
    aliases: ['Scarlett', 'Johansson', 'ScarJo', 'Black Widow'],
  },
  {
    id: 'robert-downey-jr',
    name: 'Robert Downey Jr',
    imageUrl: 'robertDowneyjr.jpg',
    aliases: ['Robert Downey Jr', 'RDJ', 'Iron Man', 'Tony Stark', 'Robert Downey'],
  },
  {
    id: 'emma-stone',
    name: 'Emma Stone',
    imageUrl: 'emmaStone.jpg',
    aliases: ['Emma', 'Stone'],
  },
  {
    id: 'chris-evans',
    name: 'Chris Evans',
    imageUrl: 'chrisEvans.jpg',
    aliases: ['Chris', 'Evans', 'Captain America', 'Steve Rogers'],
  },
  {
    id: 'margot-robbie',
    name: 'Margot Robbie',
    imageUrl: 'margotRobbie.jpg',
    aliases: ['Margot', 'Robbie', 'Harley Quinn'],
  },
  {
    id: 'jennifer-lopez',
    name: 'Jennifer Lopez',
    imageUrl: 'jenniferLopez.jpg',
    aliases: ['Jennifer Lopez', 'JLo', 'J.Lo', 'Lopez'],
  },

  // Musicians/Rappers
  {
    id: 'eminem',
    name: 'Eminem',
    imageUrl: 'eminem.jpg',
    aliases: ['Marshall Mathers', 'Slim Shady', 'Em'],
  },
  {
    id: 'kanye-west',
    name: 'Kanye West',
    imageUrl: 'kanyeWest.jpg',
    aliases: ['Kanye', 'West', 'Ye', 'Yeezy'],
  },
  {
    id: 'jay-z',
    name: 'Jay-Z',
    imageUrl: 'jayZ.jpg',
    aliases: ['Jay Z', 'Shawn Carter', 'Hov', 'Jigga'],
  },
  {
    id: 'kendrick-lamar',
    name: 'Kendrick Lamar',
    imageUrl: 'kendrikLamar.jpg',
    aliases: ['Kendrick', 'Lamar', 'K Dot', 'K.Dot'],
  },
  {
    id: 'j-cole',
    name: 'J. Cole',
    imageUrl: 'jCole.jpg',
    aliases: ['J Cole', 'Cole', 'Jermaine Cole'],
  },
  {
    id: '21-savage',
    name: '21 Savage',
    imageUrl: '21Savage.jpg',
    aliases: ['21', 'Savage', 'Twenty One Savage'],
  },
  {
    id: 'future',
    name: 'Future',
    imageUrl: 'future.jpg',
    aliases: ['Nayvadius', 'Future Hendrix'],
  },
  {
    id: 'lil-wayne',
    name: 'Lil Wayne',
    imageUrl: 'lilWayne.jpg',
    aliases: ['Wayne', 'Weezy', 'Tunechi', 'Dwayne Carter'],
  },
  {
    id: 'lil-nas-x',
    name: 'Lil Nas X',
    imageUrl: 'lilnasX.jpg',
    aliases: ['Lil Nas', 'Montero', 'Nas X'],
  },
  {
    id: 'snoop-dogg',
    name: 'Snoop Dogg',
    imageUrl: 'snoopDogg.jpg',
    aliases: ['Snoop', 'Snoopy', 'Calvin Broadus', 'Snoop Lion'],
  },
  {
    id: 'chris-brown',
    name: 'Chris Brown',
    imageUrl: 'chrisBrown.jpg',
    aliases: ['Chris', 'Brown', 'CB', 'Breezy'],
  },
  {
    id: 'usher',
    name: 'Usher',
    imageUrl: 'usher.jpg',
    aliases: ['Usher Raymond'],
  },
  {
    id: 'bruno-mars',
    name: 'Bruno Mars',
    imageUrl: 'brunoMars.jpg',
    aliases: ['Bruno', 'Mars', 'Peter Hernandez'],
  },
  {
    id: 'ed-sheeran',
    name: 'Ed Sheeran',
    imageUrl: 'edSheeran.jpg',
    aliases: ['Ed', 'Sheeran', 'Edward Sheeran'],
  },
  {
    id: 'harry-styles',
    name: 'Harry Styles',
    imageUrl: 'harryStyles.jpg',
    aliases: ['Harry', 'Styles', 'One Direction'],
  },
  {
    id: 'dua-lipa',
    name: 'Dua Lipa',
    imageUrl: 'duaLipa.jpg',
    aliases: ['Dua', 'Lipa'],
  },
  {
    id: 'olivia-rodrigo',
    name: 'Olivia Rodrigo',
    imageUrl: 'oliviaRodrigo.jpg',
    aliases: ['Olivia', 'Rodrigo', 'Liv'],
  },
  {
    id: 'lana-del-rey',
    name: 'Lana Del Rey',
    imageUrl: 'lanadelRay.jpg',
    aliases: ['Lana', 'Del Rey', 'Elizabeth Grant'],
  },
  {
    id: 'shakira',
    name: 'Shakira',
    imageUrl: 'shakira.jpg',
    aliases: ['Shakira Mebarak'],
  },
  {
    id: 'ice-spice',
    name: 'Ice Spice',
    imageUrl: 'iceSpice.jpg',
    aliases: ['Ice', 'Spice', 'Isis Gaston'],
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
