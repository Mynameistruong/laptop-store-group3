import { useEffect, useState, useCallback } from 'react';

export function useAxios(fetcher, dependencies = []) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher({ signal: controller.signal });
      setData(result);
      return result;
    } catch (err) {
      const isAbort = err?.name === 'AbortError' || err?.message === 'canceled';
      if (!isAbort) {
        setError(err?.message || 'Có lỗi xảy ra');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcher({ signal: controller.signal });
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        const isAbort = err?.name === 'AbortError' || err?.message === 'canceled';
        if (!isAbort && isMounted) {
          setError(err?.message || 'Có lỗi xảy ra');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, dependencies);

  return { data, loading, error, setData, refetch };
}
