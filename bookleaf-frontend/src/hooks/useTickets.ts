import { useState, useCallback } from 'react';

interface Ticket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      // Placeholder API call
      // const response = await fetch('/api/v1/tickets');
      // const data = await response.json();
      
      setTickets([
        { id: 't1', userId: 'u1', subject: 'Login issue', status: 'resolved' },
        { id: 't2', userId: 'u2', subject: 'Cannot publish book', status: 'open' },
      ]);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { tickets, loading, fetchTickets };
};