import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { formatPrice, getSellingPrice } from '../../utils/format';

export default function LaptopCard({ laptop }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/laptops/${laptop.id}` } } });
      return;
    }

    const result = await addToCart(laptop, 1);
    if (result?.success) {
      showToast('Đã thêm vào giỏ hàng', 'success');
    }
  };

  return (
    <Card className="h-100 laptop-card border-0 shadow-sm">
      <Link to={`/laptops/${laptop.id}`} className="text-decoration-none text-dark">
        <div className="overflow-hidden rounded-top">
          <img
            src={laptop.image || '/no-image.svg'}
            alt={laptop.name}
            className="laptop-card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/no-image.svg';
            }}
          />
        </div>
      </Link>

      <Card.Body className="d-flex flex-column">
        <Link to={`/laptops/${laptop.id}`} className="text-decoration-none text-dark">
          <Card.Title className="line-clamp-2 small mb-2">{laptop.name}</Card.Title>
        </Link>

        <div className="mb-2">
          <span className="badge bg-light text-dark me-1">{laptop.cpu}</span>
          <span className="badge bg-light text-dark me-1">RAM {laptop.ram}GB</span>
          <span className="badge bg-light text-dark">SSD {laptop.storage}GB</span>
        </div>

        <div className="mt-auto">
          {laptop.stock === 0 ? <span className="badge bg-secondary mb-2">Hết hàng</span> : null}
          <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div>
              <div className="fw-bold text-danger">{formatPrice(getSellingPrice(laptop))}</div>
              {laptop.salePrice && laptop.salePrice < laptop.price ? (
                <small className="text-decoration-line-through text-muted">{formatPrice(laptop.price)}</small>
              ) : null}
            </div>
            <Button
              size="sm"
              variant={laptop.stock === 0 ? 'secondary' : 'primary'}
              disabled={laptop.stock === 0}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
