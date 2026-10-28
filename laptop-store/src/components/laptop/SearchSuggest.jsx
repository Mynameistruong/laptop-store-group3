import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function SearchSuggest() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await axiosClient.get('/laptops', {
          params: { q: query, _limit: 5 },
          signal: controller.signal,
        });
        setSuggestions(response.data);
      } catch {
        setSuggestions([]);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      navigate(`/laptops?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="position-relative w-100">
      <input
        type="text"
        className="form-control"
        value={query}
        placeholder="Tìm laptop..."
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {open && suggestions.length > 0 ? (
        <div className="list-group search-suggest-list shadow-sm border rounded overflow-hidden">
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              onClick={() => {
                navigate(`/laptops/${item.id}`);
                setOpen(false);
                setQuery('');
              }}
            >
              <span>{item.name}</span>
              <small className="text-muted">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(item.salePrice ?? item.price)}</small>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
