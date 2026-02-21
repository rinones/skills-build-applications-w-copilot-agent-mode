import { useEffect, useMemo, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const endpoint = `${baseUrl}/api/activities/`;

  useEffect(() => {
    const fetchActivities = async () => {
      console.log('Activities endpoint:', endpoint);
      try {
        const response = await fetch(endpoint);
        const payload = await response.json();
        console.log('Activities data:', payload);
        const items = Array.isArray(payload) ? payload : payload?.results || [];
        setActivities(items);
      } catch (fetchError) {
        console.log('Activities fetch error:', fetchError);
        setError('Failed to load activities.');
      }
    };

    fetchActivities();
  }, [endpoint]);

  const visibleActivities = useMemo(() => {
    if (!filter.trim()) {
      return activities;
    }

    const lowered = filter.toLowerCase();
    return activities.filter((activity) =>
      JSON.stringify(activity).toLowerCase().includes(lowered)
    );
  }, [activities, filter]);

  return (
    <section className="card shadow-sm">
      <div className="card-header d-flex flex-wrap gap-3 align-items-center justify-content-between">
        <div>
          <h2 className="h4 mb-1">Activities</h2>
          <p className="text-muted mb-0">Recent activity logs from the API.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <a className="btn btn-outline-secondary btn-sm" href={endpoint} target="_blank" rel="noreferrer">
            View API
          </a>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#activitiesModal"
          >
            Summary
          </button>
        </div>
      </div>
      <div className="card-body">
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <form className="row g-2 align-items-center mb-3">
          <div className="col-sm-8 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Filter activities"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </div>
          <div className="col-sm-4 col-md-3">
            <button type="button" className="btn btn-outline-primary w-100">
              Apply Filter
            </button>
          </div>
        </form>
        <div className="table-responsive data-table">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">ID</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {visibleActivities.length ? (
                visibleActivities.map((activity, index) => (
                  <tr key={activity?.id ?? activity?._id ?? index}>
                    <td>{index + 1}</td>
                    <td>{activity?.id ?? activity?._id ?? '—'}</td>
                    <td>
                      <pre className="mb-0 small">{JSON.stringify(activity, null, 2)}</pre>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No activities available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="modal fade"
        id="activitiesModal"
        tabIndex="-1"
        aria-labelledby="activitiesModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="activitiesModalLabel">
                Activities Summary
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="mb-2">Total activities loaded:</p>
              <h3 className="h4">{activities.length}</h3>
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

export default Activities;
