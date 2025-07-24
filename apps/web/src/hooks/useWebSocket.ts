import { useEffect, useRef, useState } from 'react';

interface WebSocketHookOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface WebSocketHookResult {
  data: any | null;
  error: Event | null;
  status: 'CONNECTING' | 'OPEN' | 'CLOSED' | 'ERROR';
}

export const useWebSocket = (
  url: string,
  options: WebSocketHookOptions = {}
): WebSocketHookResult => {
  const {
    onMessage,
    onError,
    reconnectAttempts = 3,
    reconnectInterval = 5000,
  } = options;

  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const [status, setStatus] =
    useState<WebSocketHookResult['status']>('CONNECTING');

  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimeoutId = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setStatus('OPEN');
        setError(null);
        reconnectCount.current = 0;
      };

      ws.current.onmessage = event => {
        const parsed = JSON.parse(event.data);
        setData(parsed);
        onMessage?.(parsed);
      };

      ws.current.onerror = event => {
        setStatus('ERROR');
        setError(event);
        onError?.(event);
      };

      ws.current.onclose = () => {
        setStatus('CLOSED');

        // Versuche Reconnect wenn maximal Anzahl nicht erreicht
        if (reconnectCount.current < reconnectAttempts) {
          reconnectCount.current += 1;
          reconnectTimeoutId.current = setTimeout(connect, reconnectInterval);
        }
      };
    } catch (err) {
      setStatus('ERROR');
      setError(err as Event);
      onError?.(err as Event);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeoutId.current) {
        clearTimeout(reconnectTimeoutId.current);
      }
    };
  }, [url]);

  return { data, error, status };
};
