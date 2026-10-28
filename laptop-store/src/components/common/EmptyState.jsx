export default function EmptyState({ icon = '📦', message = 'Không tìm thấy laptop phù hợp', children }) {
  return (
    <div className="text-center py-5 text-secondary">
      <div style={{ fontSize: 32 }}>{icon}</div>
      <p className="mt-3 mb-2 fw-semibold">{message}</p>
      {children}
    </div>
  );
}
