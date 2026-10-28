import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { laptopApi } from '../api/laptopApi';
import { reviewApi } from '../api/reviewApi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatPrice, getSellingPrice } from '../utils/format';

export default function LaptopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [laptop, setLaptop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadPage() {
      try {
        setLoading(true);
        const laptopData = await laptopApi.getById(id, controller.signal);
        setLaptop(laptopData);

        const results = await Promise.allSettled([
          reviewApi.getByLaptop(laptopData.id, controller.signal),
          laptopApi.getRelated(laptopData, controller.signal),
        ]);

        if (results[0].status === 'fulfilled') setReviews(results[0].value);
        if (results[1].status === 'fulfilled') setRelated(results[1].value);
      } catch (err) {
        if (err?.status === 404 || err?.response?.status === 404) {
          setError('Không tìm thấy dữ liệu');
        } else {
          setError(err?.message || 'Không tải được dữ liệu');
        }
      } finally {
        setLoading(false);
      }
    }

    loadPage();
    return () => controller.abort();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/laptops/${id}` } } });
      return;
    }
    const result = await addToCart(laptop, 1);
    if (result?.success) {
      navigate('/cart');
    }
  };

  if (loading) return <div className="text-center py-5">Đang tải...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!laptop) return <Alert variant="warning">Không tìm thấy dữ liệu</Alert>;

  return (
    <Container>
      <div className="mb-3">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>← Quay lại</Button>
      </div>

      <Row className="g-4 align-items-start">
        <Col md={5}>
          <img src={laptop.image || '/no-image.svg'} alt={laptop.name} className="img-fluid rounded shadow-sm" />
        </Col>
        <Col md={7}>
          <div className="mb-2 text-muted small">Trang chủ / Laptop / {laptop.name}</div>
          <h2 className="fw-bold mb-3">{laptop.name}</h2>
          <div className="mb-3">
            <Badge bg="warning" text="dark" className="me-2">{laptop.rating || 5}/5</Badge>
            {laptop.stock === 0 ? <Badge bg="secondary">Hết hàng</Badge> : <Badge bg="success">Còn {laptop.stock} sản phẩm</Badge>}
          </div>
          <div className="fs-4 fw-bold text-danger mb-3">{formatPrice(getSellingPrice(laptop))}</div>
          <p>{laptop.description}</p>
          <Button variant="primary" size="lg" disabled={laptop.stock === 0} onClick={handleAddToCart}>
            Thêm vào giỏ
          </Button>
        </Col>
      </Row>

      <div className="mt-5">
        <Tabs defaultActiveKey="specs" className="mb-3">
          <Tab eventKey="specs" title="Thông số kỹ thuật">
            <table className="table table-striped">
              <tbody>
                <tr><th>CPU</th><td>{laptop.cpu}</td></tr>
                <tr><th>RAM</th><td>{laptop.ram} GB</td></tr>
                <tr><th>SSD</th><td>{laptop.storage} GB</td></tr>
                <tr><th>Màn hình</th><td>{laptop.screen}</td></tr>
                <tr><th>GPU</th><td>{laptop.gpu}</td></tr>
                <tr><th>Trọng lượng</th><td>{laptop.weight} kg</td></tr>
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="reviews" title={`Đánh giá (${reviews.length})`}>
            {reviews.length === 0 ? <Alert variant="warning">Không có đánh giá nào.</Alert> : reviews.map((review) => (
              <div key={review.id} className="border-bottom py-3">
                <div className="fw-semibold">{review.userName}</div>
                <div className="text-warning mb-1">{'★'.repeat(review.rating)}</div>
                <div>{review.comment}</div>
                <small className="text-muted">{formatDate(review.createdAt)}</small>
              </div>
            ))}
          </Tab>
        </Tabs>
      </div>

      <div className="mt-5">
        <h4>Sản phẩm tương tự</h4>
        <Row className="g-4 mt-2">
          {related.map((item) => (
            <Col key={item.id} md={3}>
              <Link to={`/laptops/${item.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm border-0">
                  <img src={item.image || '/no-image.svg'} alt={item.name} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
                  <div className="card-body">
                    <div className="small line-clamp-2">{item.name}</div>
                    <div className="text-danger fw-bold mt-2">{formatPrice(item.salePrice ?? item.price)}</div>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}
