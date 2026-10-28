export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
      <span>{message || 'Có lỗi xảy ra'}</span>
      {onRetry ? (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Thử lại
        </button>
      ) : null}
    </div>
  );
}
