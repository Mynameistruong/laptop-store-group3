import { Badge } from 'react-bootstrap';
import { getDiscountPercent, getSellingPrice } from '../../utils/format';

export default function Price({ laptop, size = 'md' }) {
  if (!laptop) return null;

  const sellingPrice = getSellingPrice(laptop);
  const discount = getDiscountPercent(laptop);

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <span className={`fw-bold text-danger ${size === 'sm' ? 'small' : ''}`}>
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(sellingPrice)}
      </span>
      {laptop.salePrice && laptop.salePrice < laptop.price ? (
        <>
          <span className="text-muted text-decoration-line-through small">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(laptop.price)}
          </span>
          <Badge bg="danger">-{discount}%</Badge>
        </>
      ) : null}
    </div>
  );
}
