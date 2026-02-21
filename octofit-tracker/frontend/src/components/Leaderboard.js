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
    <section className="card shadow-sm">
      <div className="card-header d-flex flex-wrap gap-3 align-items-center justify-content-between">
        <div>
          <h2 className="h4 mb-1">Leaderboard</h2>
          <p className="text-muted mb-0">Competitive rankings and achievements.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <a className="btn btn-outline-secondary btn-sm" href={endpoint} target="_blank" rel="noreferrer">
            View API
          </a>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#leaderboardModal"
          >
            Summary
          </button>
        </div>
      </div>
      <div className="card-body">
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <div className="table-responsive data-table">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Entry ID</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.length ? (
                entries.map((entry, index) => (
                  <tr key={entry?.id ?? entry?._id ?? index}>
                    <td>{index + 1}</td>
                    <td>{entry?.id ?? entry?._id ?? '—'}</td>
                    <td>
                      <pre className="mb-0 small">{JSON.stringify(entry, null, 2)}</pre>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No leaderboard entries available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="modal fade"
        id="leaderboardModal"
        tabIndex="-1"
        aria-labelledby="leaderboardModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="leaderboardModalLabel">
                Leaderboard Summary
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="mb-2">Total entries loaded:</p>
              <h3 className="h4">{entries.length}</h3>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
