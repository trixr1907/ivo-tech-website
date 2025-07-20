export interface RoastEntry {
  id: string;
  content: string;
  level: 'mild' | 'medium' | 'savage';
  category: 'crypto' | 'tech' | 'general' | 'investment';
  tags: string[];
  markdown: boolean;
  createdAt: Date;
  author?: string;
}

export interface RoastSettings {
  humorLevel: 'mild' | 'medium' | 'savage';
  categories: string[];
  enableMarkdown: boolean;
  rotationInterval: number;
  maxLength: number;
}

export class RoastEngine {
  private roasts: RoastEntry[] = [];
  private settings: RoastSettings;
  private currentIndex: number = 0;

  constructor(settings: Partial<RoastSettings> = {}) {
    this.settings = {
      humorLevel: 'mild',
      categories: ['crypto', 'tech', 'general'],
      enableMarkdown: true,
      rotationInterval: 3000,
      maxLength: 280,
      ...settings,
    };

    this.initializeRoasts();
  }

  private initializeRoasts(): void {
    this.roasts = [
      {
        id: '1',
        content:
          '**Still waiting** for that Bitcoin crash since _2009_? 📉😂\n\n> "It\'s a bubble!" - Every year since 2009',
        level: 'mild',
        category: 'crypto',
        tags: ['bitcoin', 'crash', 'bubble'],
        markdown: true,
        createdAt: new Date(),
        author: 'RoastBot',
      },
      {
        id: '2',
        content: 'Your portfolio is **flatter** than the Earth you think it is 🌍💸',
        level: 'medium',
        category: 'investment',
        tags: ['portfolio', 'flat-earth', 'investing'],
        markdown: true,
        createdAt: new Date(),
      },
      {
        id: '3',
        content:
          '```\nif (understanding.blockchain === false) {\n  return "It\'s just a fad!";\n}\n```\n\nYour code logic right there 👆',
        level: 'savage',
        category: 'tech',
        tags: ['blockchain', 'coding', 'understanding'],
        markdown: true,
        createdAt: new Date(),
      },
      {
        id: '4',
        content:
          'HODL? More like **NOPE-L** for you! 💎🙌\n\n### Diamond Hands vs Paper Hands\n- ✅ Diamond Hands: _Hold through volatility_\n- ❌ Paper Hands: _Panic sell every dip_',
        level: 'mild',
        category: 'crypto',
        tags: ['hodl', 'diamond-hands', 'investing'],
        markdown: true,
        createdAt: new Date(),
      },
      {
        id: '5',
        content:
          '## The Traditional Banking Experience™\n\n1. **Pay fees** to access _your own money_\n2. **Wait 3-5 business days** for transfers\n3. **Get 0.01% interest** while inflation is 8%\n4. **Repeat** until broke 🏦😭',
        level: 'medium',
        category: 'crypto',
        tags: ['banking', 'fees', 'defi'],
        markdown: true,
        createdAt: new Date(),
      },
      {
        id: '6',
        content:
          '### Web3 Evolution Chart\n\n```\nWeb 1.0: Read\nWeb 2.0: Read + Write\nWeb 3.0: Read + Write + Own\nYou: Still trying to understand Web 2.0\n```\n\n🕸️🧠 _Maybe start with Web 2.5?_',
        level: 'savage',
        category: 'tech',
        tags: ['web3', 'evolution', 'understanding'],
        markdown: true,
        createdAt: new Date(),
      },
      {
        id: '7',
        content:
          '**Your investment strategy flowchart:**\n\n```mermaid\nflowchart TD\n    A[See Green Candles] --> B[Buy High]\n    B --> C[Price Drops]\n    C --> D[Panic Sell]\n    D --> E[Repeat]\n    E --> F[Wonder Why Broke]\n```\n\n📊🤡 _Classic move!_',
        level: 'savage',
        category: 'investment',
        tags: ['strategy', 'buy-high', 'sell-low'],
        markdown: true,
        createdAt: new Date(),
      },
      {
        id: '8',
        content:
          '_"Satoshi would be disappointed in your paper hands"_ 📄🤲\n\n> **Fun Fact:** Satoshi\'s coins haven\'t moved since 2009\n> **Your coins:** Moved 47 times this week',
        level: 'savage',
        category: 'crypto',
        tags: ['satoshi', 'paper-hands', 'hodl'],
        markdown: true,
        createdAt: new Date(),
      },
      {
        id: '9',
        content:
          '### DeFi vs Traditional Finance\n\n| Feature | DeFi | Your Bank |\n|---------|------|----------|\n| **Fees** | Low/None | _Everything_ |\n| **Speed** | Instant | _3-5 days_ |\n| **Access** | 24/7 | _9-5 Mon-Fri_ |\n| **Yield** | 5-20% | _0.01%_ |\n\n🏛️😂 _Still choosing the bank?_',
        level: 'medium',
        category: 'crypto',
        tags: ['defi', 'banking', 'comparison'],
        markdown: true,
        createdAt: new Date(),
      },
      {
        id: '10',
        content:
          '## Types of Crypto Investors\n\n### 🦍 Diamond Hands\n- Bought in 2017, still holding\n- _"This is fine"_ during crashes\n\n### 📄 Paper Hands  \n- Bought yesterday, sold today\n- _"I knew it was a scam!"_\n\n### 🤡 You\n- **Combines worst of both**\n- Sells bottoms, buys tops',
        level: 'savage',
        category: 'crypto',
        tags: ['investor-types', 'diamond-hands', 'paper-hands'],
        markdown: true,
        createdAt: new Date(),
      },
    ];
  }

  public getFilteredRoasts(): RoastEntry[] {
    return this.roasts.filter(roast => {
      const levelMatch = this.matchesHumorLevel(roast.level);
      const categoryMatch = this.settings.categories.includes(roast.category);
      const lengthMatch = roast.content.length <= this.settings.maxLength;

      return levelMatch && categoryMatch && lengthMatch;
    });
  }

  private matchesHumorLevel(roastLevel: string): boolean {
    const levels = { mild: 1, medium: 2, savage: 3 };
    const currentLevel = levels[this.settings.humorLevel as keyof typeof levels];
    const roastLevelValue = levels[roastLevel as keyof typeof levels];

    return roastLevelValue <= currentLevel;
  }

  public getRandomRoast(): RoastEntry {
    const filteredRoasts = this.getFilteredRoasts();
    if (filteredRoasts.length === 0) {
      return this.createFallbackRoast();
    }

    const randomIndex = Math.floor(Math.random() * filteredRoasts.length);
    return filteredRoasts[randomIndex];
  }

  public getNextRoast(): RoastEntry {
    const filteredRoasts = this.getFilteredRoasts();
    if (filteredRoasts.length === 0) {
      return this.createFallbackRoast();
    }

    this.currentIndex = (this.currentIndex + 1) % filteredRoasts.length;
    return filteredRoasts[this.currentIndex];
  }

  private createFallbackRoast(): RoastEntry {
    return {
      id: 'fallback',
      content: 'No roasts available for current settings 🤷‍♂️',
      level: 'mild',
      category: 'general',
      tags: ['fallback'],
      markdown: false,
      createdAt: new Date(),
    };
  }

  public addCustomRoast(roast: Omit<RoastEntry, 'id' | 'createdAt'>): void {
    const newRoast: RoastEntry = {
      ...roast,
      id: `custom-${Date.now()}`,
      createdAt: new Date(),
    };

    this.roasts.push(newRoast);
  }

  public updateSettings(newSettings: Partial<RoastSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  public getSettings(): RoastSettings {
    return { ...this.settings };
  }

  public getRoastsByCategory(category: string): RoastEntry[] {
    return this.roasts.filter(roast => roast.category === category);
  }

  public getRoastsByTag(tag: string): RoastEntry[] {
    return this.roasts.filter(roast => roast.tags.includes(tag));
  }

  public searchRoasts(query: string): RoastEntry[] {
    const lowercaseQuery = query.toLowerCase();
    return this.roasts.filter(
      roast =>
        roast.content.toLowerCase().includes(lowercaseQuery) ||
        roast.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        roast.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Markdown processing utilities
  public processMarkdown(content: string): string {
    if (!this.settings.enableMarkdown) {
      return this.stripMarkdown(content);
    }

    return content;
  }

  private stripMarkdown(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/`(.*?)`/g, '$1') // Inline code
      .replace(/```[\s\S]*?```/g, '') // Code blocks
      .replace(/#{1,6}\s/g, '') // Headers
      .replace(/>\s/g, '') // Quotes
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/\n/g, ' ') // New lines
      .trim();
  }

  // Statistics
  public getStats() {
    const total = this.roasts.length;
    const byLevel = {
      mild: this.roasts.filter(r => r.level === 'mild').length,
      medium: this.roasts.filter(r => r.level === 'medium').length,
      savage: this.roasts.filter(r => r.level === 'savage').length,
    };
    const byCategory = this.roasts.reduce(
      (acc, roast) => {
        acc[roast.category] = (acc[roast.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total,
      byLevel,
      byCategory,
      markdownEnabled: this.settings.enableMarkdown,
      currentSettings: this.settings,
    };
  }
}

// Export singleton instance
export const roastEngine = new RoastEngine();

// Export utility functions
export const createRoastEngine = (settings?: Partial<RoastSettings>) => {
  return new RoastEngine(settings);
};

export const formatRoastForDisplay = (roast: RoastEntry, enableMarkdown: boolean = true): string => {
  if (enableMarkdown && roast.markdown) {
    return roast.content;
  }

  // Strip markdown if disabled
  return roast.content
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/>\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
};
