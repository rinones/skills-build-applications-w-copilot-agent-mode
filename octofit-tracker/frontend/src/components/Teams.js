import { useEffect, useState } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const endpoint = `${baseUrl}/api/teams/`;

  useEffect(() => {
    const fetchTeams = async () => {
      console.log('Teams endpoint:', endpoint);
      try {
        const response = await fetch(endpoint);
        const payload = await response.json();
        console.log('Teams data:', payload);
        const items = Array.isArray(payload) ? payload : payload?.results || [];
        setTeams(items);
      } catch (fetchError) {
        console.log('Teams fetch error:', fetchError);
        setError('Failed to load teams.');
      }
    };

    fetchTeams();
  }, [endpoint]);

  return (
    <section>
      <h2 className="mb-3">Teams</h2>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      <ul className="list-group">
        {teams.map((team, index) => (
          <li className="list-group-item" key={team?.id ?? team?._id ?? index}>
            <pre className="mb-0">{JSON.stringify(team, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Teams;
