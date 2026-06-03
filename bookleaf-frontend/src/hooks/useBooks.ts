import { useState, useEffect, useCallback } from 'react';

export interface Book {
  id: string;
  title: string;
  authorId: string;
  status: 'draft' | 'published';
  publishedAt?: string;
}

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual Express API endpoint
      // const response = await fetch('/api/v1/books');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData: Book[] = [
        { id: '1', title: 'The Silent Echo', authorId: 'a1', status: 'draft' },
        { id: '2', title: 'Beyond the Horizon', authorId: 'a1', status: 'published', publishedAt: '2023-10-12' }
      ];
      setBooks(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks };
};