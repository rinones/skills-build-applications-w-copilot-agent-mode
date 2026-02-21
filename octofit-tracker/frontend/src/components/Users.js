import { useEffect, useMemo, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const endpoint = `${baseUrl}/api/users/`;

  useEffect(() => {
    const fetchUsers = async () => {
      console.log('Users endpoint:', endpoint);
      try {
        const response = await fetch(endpoint);
        const payload = await response.json();
        console.log('Users data:', payload);
        const items = Array.isArray(payload) ? payload : payload?.results || [];
        setUsers(items);
      } catch (fetchError) {
        console.log('Users fetch error:', fetchError);
        setError('Failed to load users.');
      }
    };

    fetchUsers();
  }, [endpoint]);

  const visibleUsers = useMemo(() => {
    if (!filter.trim()) {
      return users;
    }

    const lowered = filter.toLowerCase();
    return users.filter((user) => JSON.stringify(user).toLowerCase().includes(lowered));
  }, [users, filter]);

  return (
    <section className="card shadow-sm">
      <div className="card-header d-flex flex-wrap gap-3 align-items-center justify-content-between">
        <div>
          <h2 className="h4 mb-1">Users</h2>
          <p className="text-muted mb-0">Registered athletes and coaches.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <a className="btn btn-outline-secondary btn-sm" href={endpoint} target="_blank" rel="noreferrer">
            View API
          </a>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#usersModal"
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
              placeholder="Filter users"
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
              {visibleUsers.length ? (
                visibleUsers.map((user, index) => (
                  <tr key={user?.id ?? user?._id ?? index}>
                    <td>{index + 1}</td>
                    <td>{user?.id ?? user?._id ?? '—'}</td>
                    <td>
                      <pre className="mb-0 small">{JSON.stringify(user, null, 2)}</pre>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No users available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="modal fade"
        id="usersModal"
        tabIndex="-1"
        aria-labelledby="usersModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="usersModalLabel">
                Users Summary
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="mb-2">Total users loaded:</p>
              <h3 className="h4">{users.length}</h3>
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

export default Users;
