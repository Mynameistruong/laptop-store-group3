import { Button, Col, Form, Row } from 'react-bootstrap';

export default function LaptopFilter({ filters, onChange, onReset, brands, categories, idPrefix = 'filter' }) {
  const handleField = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Bộ lọc</h5>
        <Button variant="link" className="p-0 text-decoration-none" onClick={onReset}>Xóa bộ lọc</Button>
      </div>

      <div className="mb-4">
        <h6>Hãng</h6>
        <Form.Group>
          {brands.map((brand) => (
            <Form.Check
              key={brand.id}
              type="radio"
              name={`${idPrefix}-brand`}
              id={`${idPrefix}-brand-${brand.id}`}
              label={brand.name}
              checked={Number(filters.brandId) === Number(brand.id)}
              onChange={() => handleField('brandId', String(brand.id))}
            />
          ))}
        </Form.Group>
      </div>

      <div className="mb-4">
        <h6>Loại</h6>
        <Form.Group>
          {categories.map((category) => (
            <Form.Check
              key={category.id}
              type="radio"
              name={`${idPrefix}-category`}
              id={`${idPrefix}-category-${category.id}`}
              label={category.name}
              checked={Number(filters.categoryId) === Number(category.id)}
              onChange={() => handleField('categoryId', String(category.id))}
            />
          ))}
        </Form.Group>
      </div>

      <div className="mb-4">
        <h6>Khoảng giá</h6>
        <Row>
          <Col xs={6}>
            <Form.Control
              type="number"
              value={filters.priceMin || ''}
              placeholder="Từ"
              onChange={(e) => handleField('priceMin', e.target.value)}
            />
          </Col>
          <Col xs={6}>
            <Form.Control
              type="number"
              value={filters.priceMax || ''}
              placeholder="Đến"
              onChange={(e) => handleField('priceMax', e.target.value)}
            />
          </Col>
        </Row>
      </div>

      <div>
        <h6>RAM tối thiểu</h6>
        <Form.Select value={filters.ramMin || ''} onChange={(e) => handleField('ramMin', e.target.value)}>
          <option value="">Tất cả</option>
          <option value="8">8GB</option>
          <option value="16">16GB</option>
          <option value="32">32GB</option>
        </Form.Select>
      </div>
    </div>
  );
}
