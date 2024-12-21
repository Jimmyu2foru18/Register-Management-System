import { useState, useEffect, useCallback } from './react-imports';
import type { DependencyList } from 'react';

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      const result = await asyncFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    execute();
  }, [...deps]);

  return { data, loading, error };
}
