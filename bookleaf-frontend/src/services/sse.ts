const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

export const sseService = {
  subscribe: (endpoint: string, onMessage: (data: any) => void, onError?: (error: Event) => void) => {
    const eventSource = new EventSource(`${API_BASE_URL}${endpoint}`);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData);
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Connection Error:', error);
      if (onError) onError(error);
      eventSource.close(); 
    };

    // Return a cleanup function to close the connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }
};