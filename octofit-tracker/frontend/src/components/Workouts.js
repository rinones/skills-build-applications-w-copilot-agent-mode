import { useEffect, useState } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const endpoint = `${baseUrl}/api/workouts/`;

  useEffect(() => {
    const fetchWorkouts = async () => {
      console.log('Workouts endpoint:', endpoint);
      try {
        const response = await fetch(endpoint);
        const payload = await response.json();
        console.log('Workouts data:', payload);
        const items = Array.isArray(payload) ? payload : payload?.results || [];
        setWorkouts(items);
      } catch (fetchError) {
        console.log('Workouts fetch error:', fetchError);
        setError('Failed to load workouts.');
      }
    };

    fetchWorkouts();
  }, [endpoint]);

  return (
    <section>
      <h2 className="mb-3">Workouts</h2>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      <ul className="list-group">
        {workouts.map((workout, index) => (
          <li className="list-group-item" key={workout?.id ?? workout?._id ?? index}>
            <pre className="mb-0">{JSON.stringify(workout, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Workouts;
