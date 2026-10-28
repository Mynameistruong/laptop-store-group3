import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { catalogApi, laptopApi } from '../../api/laptopApi';

const emptyForm = {
  name: '',
  brandId: 1,
  categoryId: 1,
  price: '',
  salePrice: '',
  cpu: '',
  ram: 8,
  storage: 256,
  screen: '',
  gpu: '',
  weight: '',
  stock: 1,
  image: '',
  description: '',
};

export default function AdminLaptopFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadPage() {
      const [brandData, categoryData] = await Promise.all([catalogApi.getBrands(), catalogApi.getCategories()]);
      setBrands(brandData);
      setCategories(categoryData);

      if (!id) return;
      const laptop = await laptopApi.getById(id);
      setForm({
        ...laptop,
        price: laptop.price ?? '',
        salePrice: laptop.salePrice ?? '',
        stock: laptop.stock ?? 1,
        ram: laptop.ram ?? 8,
        storage: laptop.storage ?? 256,
      });
    }
    loadPage();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      brandId: Number(form.brandId),
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      ram: Number(form.ram),
      storage: Number(form.storage),
      stock: Number(form.stock),
      weight: Number(form.weight),
      sold: form.sold ?? 0,
      rating: form.rating ?? 0,
      createdAt: form.createdAt || new Date().toISOString(),
    };

    if (id) {
      await laptopApi.update(id, payload);
    } else {
      await laptopApi.create({ ...payload, sold: 0, rating: 0, createdAt: new Date().toISOString() });
    }

    navigate('/admin/laptops', { state: { message: `Đã lưu "${payload.name}"` } });
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <h3>{id ? 'Sửa laptop' : 'Thêm laptop'}</h3>
        <Form onSubmit={handleSubmit} className="mt-4">
          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Tên laptop</Form.Label>
                <Form.Control value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Hình ảnh</Form.Label>
                <Form.Control value={form.image} onChange={(e) => handleChange('image', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Thương hiệu</Form.Label>
                <Form.Select value={form.brandId} onChange={(e) => handleChange('brandId', e.target.value)}>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Loại</Form.Label>
                <Form.Select value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}><Form.Group><Form.Label>Giá</Form.Label><Form.Control type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Giá khuyến mãi</Form.Label><Form.Control type="number" value={form.salePrice} onChange={(e) => handleChange('salePrice', e.target.value)} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Tồn kho</Form.Label><Form.Control type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} /></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>RAM</Form.Label><Form.Select value={form.ram} onChange={(e) => handleChange('ram', e.target.value)}><option value={8}>8</option><option value={16}>16</option><option value={32}>32</option><option value={64}>64</option></Form.Select></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>SSD</Form.Label><Form.Select value={form.storage} onChange={(e) => handleChange('storage', e.target.value)}><option value={256}>256</option><option value={512}>512</option><option value={1024}>1024</option><option value={2048}>2048</option></Form.Select></Form.Group></Col>
            <Col md={4}><Form.Group><Form.Label>Trọng lượng</Form.Label><Form.Control type="number" step="0.1" value={form.weight} onChange={(e) => handleChange('weight', e.target.value)} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>CPU</Form.Label><Form.Control value={form.cpu} onChange={(e) => handleChange('cpu', e.target.value)} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>GPU</Form.Label><Form.Control value={form.gpu} onChange={(e) => handleChange('gpu', e.target.value)} /></Form.Group></Col>
            <Col md={12}><Form.Group><Form.Label>Mô tả</Form.Label><Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => handleChange('description', e.target.value)} /></Form.Group></Col>
          </Row>

          <div className="mt-4 d-flex gap-2">
            <Button type="submit" variant="primary">Lưu</Button>
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/laptops')}>Hủy</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
