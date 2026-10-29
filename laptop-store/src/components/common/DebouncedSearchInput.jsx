import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import useDebounce from '../../hooks/useDebounce';

export default function DebouncedSearchInput({ value, onSearch, delay = 500, ...props }) {
  const [query, setQuery] = useState(value);
  const debouncedQuery = useDebounce(query.trim(), delay);

  useEffect(() => {
    if (debouncedQuery !== value) onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch, value]);

  return <Form.Control {...props} type="search" value={query} onChange={(event) => setQuery(event.target.value)} />;
}
