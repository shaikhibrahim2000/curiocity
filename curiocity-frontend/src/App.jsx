import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs once when the component loads
    const fetchEvents = async () => {
      try {
        // Because of the proxy, we can just use '/api/events'
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data); // Store the fetched events in state
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false); // Stop loading, whether successful or not
      }
    };

    fetchEvents();
  }, []); // The empty array [] means this effect runs only once

  if (loading) {
    return <h1>Loading events...</h1>;
  }

  return (
    <div>
      <h1>CurioCity Events</h1>
      <div className="event-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p><strong>Category:</strong> {event.category_name}</p>
              <p><strong>City:</strong> {event.city}</p>
              <p><strong>Creator:</strong> {event.creator_name}</p>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
}

export default App;