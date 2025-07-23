# Content Providers API

Diese Module stellen Humor-, Meme- & News-Inhalte für die IvoTech Website bereit.

## Features

- **Developer Memes** von Imgur API
- **Crypto News** von CoinTelegraph
- **Gaming News** von IGN
- **Edge Functions** für low-latency (Next.js/Vercel)
- **Caching** für Performance-Optimierung
- **Rate Limiting** zum Schutz vor Missbrauch
- **CORS Support** für cross-origin Requests

## API Endpoints

### 1. Developer Memes

```
GET /api/content/memes?limit=10
```

**Parameter:**

- `limit` (optional): Anzahl der Memes (max: 50, default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "title": "Developer Meme",
      "description": "Funny programming joke",
      "url": "https://i.imgur.com/abc123.jpg",
      "imageUrl": "https://i.imgur.com/abc123.jpg",
      "publishedAt": "2025-01-20T12:00:00Z",
      "source": "Imgur",
      "category": "meme",
      "tags": ["programming", "developer", "humor"]
    }
  ],
  "rateLimit": {
    "remaining": 99,
    "resetTime": 1642684800
  }
}
```

### 2. Crypto News

```
GET /api/content/crypto?limit=10
```

**Parameter:**

- `limit` (optional): Anzahl der News (max: 30, default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "456",
      "title": "Bitcoin Reaches New High",
      "description": "Bitcoin price analysis...",
      "url": "https://cointelegraph.com/news/bitcoin-high",
      "imageUrl": "https://cointelegraph.com/image.jpg",
      "publishedAt": "2025-01-20T12:00:00Z",
      "source": "CoinTelegraph",
      "category": "crypto",
      "tags": ["bitcoin", "cryptocurrency", "blockchain"]
    }
  ]
}
```

### 3. Gaming News

```
GET /api/content/gaming?limit=10
```

**Parameter:**

- `limit` (optional): Anzahl der News (max: 25, default: 10)

### 4. Mixed Content Feed

```
GET /api/content/feed?limit=15&memes=true&crypto=true&gaming=false
```

**Parameter:**

- `limit` (optional): Gesamtanzahl Items (max: 50, default: 15)
- `memes` (optional): Memes einbeziehen (default: true)
- `crypto` (optional): Crypto News einbeziehen (default: true)
- `gaming` (optional): Gaming News einbeziehen (default: true)

**Response:**

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "totalItems": 15,
    "categories": {
      "memes": 5,
      "crypto": 5,
      "gaming": 5
    },
    "requestedLimit": 15,
    "includedCategories": {
      "memes": true,
      "crypto": true,
      "gaming": true
    }
  }
}
```

## Environment Variables

```env
# Imgur API Key für Developer Memes (optional)
IMGUR_CLIENT_ID=your_imgur_client_id_here
```

**Hinweis:** Ohne Imgur API Key funktionieren Crypto- und Gaming-News weiterhin, aber keine Memes.

## Rate Limits

- **Memes API**: 100 Requests/Stunde pro IP
- **Crypto API**: 150 Requests/Stunde pro IP
- **Gaming API**: 120 Requests/Stunde pro IP
- **Feed API**: 200 Requests/Stunde pro IP

## Caching

- **Memes**: 15 Minuten Cache
- **Crypto News**: 10 Minuten Cache
- **Gaming News**: 20 Minuten Cache
- **Mixed Feed**: 15 Minuten Cache

## Verwendung in React Components

```typescript
import { ContentItem } from '../lib/contentProviders';

const useMemes = () => {
  const [memes, setMemes] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemes = async (limit = 10) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content/memes?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        setMemes(data.data);
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
    setLoading(false);
  };

  return { memes, loading, fetchMemes };
};
```

## Error Handling

Alle APIs geben strukturierte Fehlerantworten zurück:

```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again later."
}
```

**Häufige HTTP Status Codes:**

- `200`: Erfolg
- `400`: Ungültige Parameter
- `429`: Rate Limit überschritten
- `500`: Server-Fehler

## Edge Runtime

Alle API-Routen nutzen Next.js Edge Runtime für:

- **Niedrige Latenz** durch globale Verbreitung
- **Bessere Performance** durch V8 Isolate
- **Automatische Skalierung** bei hohem Traffic

## Security Features

- **CORS Headers** für sichere cross-origin Requests
- **Rate Limiting** pro IP-Adresse
- **Input Validation** für alle Parameter
- **Error Sanitization** (keine internen Details in Responses)
