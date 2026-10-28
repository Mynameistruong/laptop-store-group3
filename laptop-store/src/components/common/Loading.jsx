export default function Loading({ message = 'Đang tải...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5 text-secondary">
      <div className="spinner-border text-primary me-2" role="status" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
