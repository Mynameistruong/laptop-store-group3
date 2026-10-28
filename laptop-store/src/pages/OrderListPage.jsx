import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { formatDate, formatPrice } from '../utils/format';

export default function OrderListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function loadOrders() {
      const data = await orderApi.getByUser(user.id);
      setOrders(data);
    }

    loadOrders();
  }, [user]);

  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, 'success');
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, showToast]);

  const handleCancel = async (orderId) => {
    await orderApi.updateStatus(orderId, 'cancelled');
    const next = await orderApi.getByUser(user.id);
    setOrders(next);
    showToast('Đã hủy đơn hàng', 'warning');
  };

  if (!user) return <Alert variant="warning">Bạn cần đăng nhập để xem đơn hàng.</Alert>;

  return (
    <div>
      <h3 className="mb-4">Đơn hàng của tôi</h3>
      {orders.length === 0 ? <Alert variant="info">Bạn chưa có đơn hàng nào.</Alert> : orders.map((order) => (
        <Card key={order.id} className="mb-3 shadow-sm border-0">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>Mã đơn #{order.id}</strong>
              <Badge bg={order.status === 'pending' ? 'warning' : order.status === 'cancelled' ? 'secondary' : 'success'}>
                {order.status}
              </Badge>
            </div>
            <div className="text-muted">Ngày: {formatDate(order.createdAt)}</div>
            <div className="fw-bold mt-2">Tổng: {formatPrice(order.total)}</div>
            <ul className="mb-2 mt-3">
              {order.items?.map((item, index) => (
                <li key={`${order.id}-${index}`}>{item.name} x {item.quantity}</li>
              ))}
            </ul>
            {order.status === 'pending' ? (
              <Button variant="outline-danger" onClick={() => handleCancel(order.id)}>Hủy đơn</Button>
            ) : null}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
