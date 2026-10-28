import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice, getSellingPrice } from '../utils/format';

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, reload } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) reload();
  }, [reload, user]);

  if (!user) return <Alert variant="warning">Vui lòng đăng nhập để xem giỏ hàng.</Alert>;

  if (!items.length) {
    return (
      <div className="text-center py-5">
        <h4>Giỏ hàng trống</h4>
        <Link to="/laptops" className="btn btn-primary mt-3">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <Row className="g-4">
      <Col lg={8}>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img src={item.laptop?.image || '/no-image.svg'} alt={item.laptop?.name} style={{ width: 64, height: 48, objectFit: 'cover' }} className="rounded" />
                        <div>
                          <div className="fw-semibold">{item.laptop?.name}</div>
                          <small className="text-muted">Còn {item.laptop?.stock ?? 0} sản phẩm</small>
                        </div>
                      </div>
                    </td>
                    <td>{formatPrice(getSellingPrice(item.laptop))}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}>-</Button>
                        <span>{item.quantity}</span>
                        <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}>+</Button>
                      </div>
                    </td>
                    <td>{formatPrice(getSellingPrice(item.laptop) * item.quantity)}</td>
                    <td>
                      <Button size="sm" variant="outline-danger" onClick={() => removeItem(item.id)}>Xóa</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={4}>
        <Card className="shadow-sm border-0 summary-card">
          <Card.Body>
            <h5 className="fw-bold">Tổng giỏ hàng</h5>
            <div className="d-flex justify-content-between mt-3">
              <span>Tổng tiền</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>
            <Button className="w-100 mt-4" variant="primary" onClick={() => navigate('/checkout')}>
              Tiến hành đặt hàng
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
