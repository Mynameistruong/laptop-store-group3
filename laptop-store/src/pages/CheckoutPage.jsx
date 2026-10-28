import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { cartApi } from '../api/cartApi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getSellingPrice } from '../utils/format';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clearLocal, totalPrice, reload } = useCart();
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!items.length) navigate('/cart', { replace: true });
  }, [items, navigate]);

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Họ tên là bắt buộc';
    if (!/^0\d{9}$/.test(form.phone)) next.phone = 'Số điện thoại phải 10 chữ số, bắt đầu bằng 0';
    if (!form.address.trim()) next.address = 'Địa chỉ là bắt buộc';
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);

    try {
      const laptopIds = items.map((item) => item.laptopId);
      const productList = await Promise.all(
        laptopIds.map(async (id) => {
          const res = await fetch(`http://localhost:3001/laptops/${id}`);
          return res.json();
        })
      );

      const insufficient = productList.filter((laptop) => laptop.stock < items.find((item) => item.laptopId === laptop.id)?.quantity);
      if (insufficient.length) {
        const itemName = insufficient[0].name;
        const remaining = insufficient[0].stock;
        throw { message: `${itemName} chỉ còn ${remaining} sản phẩm` };
      }

      const order = {
        userId: user.id,
        customerName: form.fullName,
        phone: form.phone,
        address: form.address,
        status: 'pending',
        total: totalPrice,
        items: items.map((item) => ({
          laptopId: item.laptopId,
          name: item.laptop.name,
          quantity: item.quantity,
          price: getSellingPrice(item.laptop),
        })),
        createdAt: new Date().toISOString(),
      };

      const created = await orderApi.create(order);

      await Promise.allSettled(
        items.map(async (item) => {
          const laptop = item.laptop;
          await fetch(`http://localhost:3001/laptops/${laptop.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: laptop.stock - item.quantity, sold: (laptop.sold || 0) + item.quantity }),
          });
        })
      );

      await Promise.allSettled(items.map((item) => cartApi.remove(item.id)));
      clearLocal();
      await reload();
      navigate('/orders', { state: { message: `Đặt hàng thành công! Mã đơn #${created.id}` } });
    } catch (err) {
      Alert(err?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <h3>Thanh toán</h3>
        <Form onSubmit={handleSubmit} className="mt-4">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Họ tên</Form.Label>
                <Form.Control value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} isInvalid={!!errors.fullName} />
                <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} isInvalid={!!errors.phone} />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} isInvalid={!!errors.address} />
                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4 text-end fw-bold fs-5">
            Tổng thanh toán: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalPrice)}
          </div>

          <Button type="submit" variant="primary" className="mt-4" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
