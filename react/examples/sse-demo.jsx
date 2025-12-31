import React, { useEffect, useRef, useState } from 'react';

export default function SSEDemo({ url = '/events' }) {
  const [events, setEvents] = useState([]);
  const esRef = useRef(null);

  useEffect(() => {
    const es = new EventSource(url);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setEvents((prev) => [parsed, ...prev].slice(0, 50));
      } catch {
        setEvents((prev) => [e.data, ...prev].slice(0, 50));
      }
    };

    es.onerror = (err) => {
      console.error('SSE error', err);
      // Close on error to avoid noisy reconnection loops in some environments
      // Reconnect logic can be added here if desired
      es.close();
    };

    return () => {
      es.close();
    };
  }, [url]);

  return (
    <div>
      <h3>Server-Sent Events Demo</h3>
      <p>Connected to: {url}</p>
      <ul>
        {events.map((ev, i) => (
          <li key={i}>{typeof ev === 'object' ? JSON.stringify(ev) : String(ev)}</li>
        ))}
      </ul>
    </div>
  );
}
