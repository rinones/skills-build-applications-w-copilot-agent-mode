import { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const endpoint = `${baseUrl}/api/leaderboard/`;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      console.log('Leaderboard endpoint:', endpoint);
      try {
        const response = await fetch(endpoint);
        const payload = await response.json();
        console.log('Leaderboard data:', payload);
        const items = Array.isArray(payload) ? payload : payload?.results || [];
        setEntries(items);
      } catch (fetchError) {
        console.log('Leaderboard fetch error:', fetchError);
        setError('Failed to load leaderboard.');
      }
    };

    fetchLeaderboard();
  }, [endpoint]);

  return (
    <section>
      <h2 className="mb-3">Leaderboard</h2>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      <ul className="list-group">
        {entries.map((entry, index) => (
          <li className="list-group-item" key={entry?.id ?? entry?._id ?? index}>
            <pre className="mb-0">{JSON.stringify(entry, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Leaderboard;
