import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { useToast } from '../contexts/ToastContext';
import axiosClient from '../api/axiosClient';

export default function HomePage() {
  const [newLaptops, setNewLaptops] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [laptopRes, bestsellerRes, brandRes, categoryRes] = await Promise.all([
          axiosClient.get('/laptops', { params: { _sort: 'createdAt', _order: 'desc', _limit: 8 } }),
          axiosClient.get('/laptops', { params: { _sort: 'sold', _order: 'desc', _limit: 4 } }),
          axiosClient.get('/brands'),
          axiosClient.get('/categories'),
        ]);

        setNewLaptops(laptopRes.data);
        setBestSellers(bestsellerRes.data);
        setBrands(brandRes.data);
        setCategories(categoryRes.data);
      } catch (err) {
        showToast(err?.message || 'Không tải được trang chủ', 'danger');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [showToast]);

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  return (
    <div>
      <div className="mb-4 p-4 rounded-4 bg-primary-subtle">
        <h2 className="fw-bold mb-3">Laptop phù hợp cho mọi nhu cầu</h2>
        <p className="mb-0 text-secondary">Khám phá laptop gaming, văn phòng, đồ họa và mỏng nhẹ với giá tốt nhất.</p>
      </div>

      <section className="mb-5">
        <h4 className="fw-bold mb-3">Bán chạy</h4>
        <Row xs={1} md={2} lg={4} className="g-4">
          {bestSellers.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img variant="top" src={item.image || '/no-image.svg'} style={{ height: 180, objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className="small line-clamp-2">{item.name}</Card.Title>
                  <div className="text-danger fw-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(item.salePrice ?? item.price)}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="mb-5">
        <h4 className="fw-bold mb-3">Mới về</h4>
        <Row xs={1} md={2} lg={4} className="g-4">
          {newLaptops.map((laptop) => (
            <Col key={laptop.id}>
              <Card className="h-100 shadow-sm border-0">
                <img src={laptop.image || '/no-image.svg'} alt={laptop.name} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className="small line-clamp-2">{laptop.name}</Card.Title>
                  <div className="text-danger fw-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(laptop.salePrice ?? laptop.price)}</div>
                  <Link to={`/laptops/${laptop.id}`} className="btn btn-outline-primary btn-sm mt-2">Xem chi tiết</Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="mb-5">
        <h4 className="fw-bold mb-3">Thương hiệu</h4>
        <div className="d-flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Button key={brand.id} variant="outline-primary" as={Link} to={`/laptops?brandId=${brand.id}`}>
              {brand.name}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h4 className="fw-bold mb-3">Danh mục</h4>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button key={category.id} variant="outline-secondary" as={Link} to={`/laptops?categoryId=${category.id}`}>
              {category.name}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
