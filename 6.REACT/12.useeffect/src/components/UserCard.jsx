export default function UserCard({ user, onRemove }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h3 className="card-title mb-1">{user.name}</h3>
          {onRemove && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                onRemove(user.id);
              }}
              type="button"
            >
              삭제
            </button>
          )}
        </div>

        <p className="card-text mb-1">email: {user.email}</p>
        <p className="card-text mb-1">phone: {user.phone}</p>
        <p className="card-text mb-1">company: {user.company.name}</p>
        <p className="card-text mb-1">
          address: {user.address.city}, {user.address.street}
        </p>
      </div>
      <div className="card-footer text-muted">User ID: {user.id}</div>
    </div>
  );
}
