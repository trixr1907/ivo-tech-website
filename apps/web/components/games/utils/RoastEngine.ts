type RoastTemplate = {
  setup: string;
  punchline: string;
  category: 'NFT' | 'Bitcoin' | 'Altcoin' | 'DeFi' | 'General';
  severity: number; // 1-5
};

const roastTemplates: RoastTemplate[] = [
  {
    setup: 'Your crypto portfolio is like a black hole:',
    punchline: "it's where money goes to disappear forever!",
    category: 'General',
    severity: 3,
  },
  {
    setup: "I heard you're still holding that NFT collection...",
    punchline:
      "at least you'll always have those expensive JPEGs to keep you warm!",
    category: 'NFT',
    severity: 4,
  },
  {
    setup: 'Your DeFi strategy is so brilliant,',
    punchline:
      'even your liquidation notifications are getting liquidation notifications!',
    category: 'DeFi',
    severity: 4,
  },
  {
    setup: 'Still waiting for Bitcoin to hit 100k?',
    punchline: 'Maybe try setting your chart to Zimbabwean dollars!',
    category: 'Bitcoin',
    severity: 3,
  },
  {
    setup: 'Your altcoin picks are like a circus:',
    punchline: 'full of clowns and guaranteed to make people laugh!',
    category: 'Altcoin',
    severity: 4,
  },
];

const modifiers = {
  mild: [
    'But hey, at least you tried!',
    "Don't worry, there's always next bull run!",
    'Keep HODLing, champion!',
    "Maybe it'll turn around... maybe.",
    "We've all been there!",
  ],
  spicy: [
    "Oof, that's gotta hurt!",
    'Need some ice for that burn?',
    'No recovery from that one!',
    'Somebody call the crypto ambulance!',
    "That's gonna leave a mark!",
  ],
};

export class RoastEngine {
  private static instance: RoastEngine;
  private lastRoasts: RoastTemplate[] = [];

  private constructor() {}

  public static getInstance(): RoastEngine {
    if (!RoastEngine.instance) {
      RoastEngine.instance = new RoastEngine();
    }
    return RoastEngine.instance;
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getModifier(severity: number, isKonamiCode: boolean): string {
    if (isKonamiCode) {
      return this.getRandomElement(modifiers.spicy);
    }
    return severity > 3
      ? this.getRandomElement(modifiers.spicy)
      : this.getRandomElement(modifiers.mild);
  }

  public generateRoast(category?: string, isKonamiCode = false): string {
    let availableRoasts = roastTemplates;

    if (category) {
      availableRoasts = roastTemplates.filter(
        roast => roast.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Vermeide Wiederholungen
    availableRoasts = availableRoasts.filter(
      roast => !this.lastRoasts.includes(roast)
    );

    if (availableRoasts.length === 0) {
      this.lastRoasts = [];
      availableRoasts = roastTemplates;
    }

    const selectedRoast = this.getRandomElement(availableRoasts);

    // Aktualisiere die Historie
    this.lastRoasts.push(selectedRoast);
    if (this.lastRoasts.length > 3) {
      this.lastRoasts.shift();
    }

    const modifier = this.getModifier(selectedRoast.severity, isKonamiCode);

    return `${selectedRoast.setup} ${selectedRoast.punchline} ${modifier}`;
  }

  public generateKonamiRoast(): string {
    return "🔥 LASER RAPTOR ACTIVATED: Your crypto picks are so bad, even prehistoric laser raptors wouldn't touch them! MAXIMUM BURN ACHIEVED! 🦖";
  }
}
