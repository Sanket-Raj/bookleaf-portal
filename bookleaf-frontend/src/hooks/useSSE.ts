import { useState, useEffect } from 'react';

export const useSSE = <T = any>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        setData(event.data);
      }
    };

    eventSource.onerror = (err) => {
      setError(err);
      setConnected(false);
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, connected, error };
};