import { useState } from 'react';
import { Button, Col, Form, Image, Row, Spinner } from 'react-bootstrap';
import { handleImageError } from '../../utils/image';
import { EMPTY_LAPTOP, RAM_CHOICES, STORAGE_CHOICES, toPayload, validateLaptop } from './laptopFormUtils';

/**
 * Form dùng chung cho thêm (POST) và sửa (PUT).
 * E5: lỗi chỉ hiện sau khi người dùng đã chạm vào ô hoặc đã bấm submit.
 */
export default function LaptopForm({ initialValues = EMPTY_LAPTOP, brands, categories, onSubmit, submitting, submitText }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validateLaptop(values);
  const showError = (field) => (touched[field] || submitted) && errors[field];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return; // kịch bản 13: còn lỗi → không gửi request
    onSubmit(toPayload(values));
  };

  /** Ô nhập có kiểm tra lỗi */
  const field = (name, label, props = {}) => (
    <Form.Group className="mb-3" controlId={`laptop-${name}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={Boolean(showError(name))}
        {...props}
      />
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  const select = (name, label, options, placeholder) => (
    <Form.Group className="mb-3" controlId={`laptop-${name}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={Boolean(showError(name))}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  const imageOk = values.image.trim().startsWith('http');

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row>
        <Col lg={8}>
          {field('name', 'Tên laptop *', { placeholder: 'Ví dụ: Dell XPS 13 9340' })}
          <Row>
            <Col md={6}>
              {select('brandId', 'Hãng *', brands.map((b) => ({ value: b.id, label: b.name })), '-- Chọn hãng --')}
            </Col>
            <Col md={6}>
              {select('categoryId', 'Loại *', categories.map((c) => ({ value: c.id, label: c.name })), '-- Chọn loại --')}
            </Col>
          </Row>
          <Row>
            <Col md={4}>{field('price', 'Giá gốc (VND) *', { type: 'number', min: 1, step: 1000 })}</Col>
            <Col md={4}>
              {field('salePrice', 'Giá khuyến mãi (VND)', {
                type: 'number',
                min: 1,
                step: 1000,
                placeholder: 'Để trống nếu không giảm',
              })}
            </Col>
            <Col md={4}>{field('stock', 'Tồn kho *', { type: 'number', min: 0, step: 1 })}</Col>
          </Row>
          <Row>
            <Col md={6}>{field('cpu', 'CPU *', { placeholder: 'Intel Core i7-13700H' })}</Col>
            <Col md={6}>{field('gpu', 'Card đồ họa *', { placeholder: 'NVIDIA RTX 4060 8GB' })}</Col>
          </Row>
          <Row>
            <Col md={4}>
              {select('ram', 'RAM *', RAM_CHOICES.map((r) => ({ value: r, label: `${r} GB` })), '-- RAM --')}
            </Col>
            <Col md={4}>
              {select(
                'storage',
                'Ổ cứng SSD *',
                STORAGE_CHOICES.map((s) => ({ value: s, label: s >= 1024 ? `${s / 1024} TB` : `${s} GB` })),
                '-- SSD --'
              )}
            </Col>
            <Col md={4}>{field('weight', 'Cân nặng (kg)', { type: 'number', min: 0, step: 0.01 })}</Col>
          </Row>
          {field('screen', 'Màn hình *', { placeholder: '14 inch 2.8K OLED 120Hz' })}
          {field('description', 'Mô tả *', { as: 'textarea', rows: 3 })}
        </Col>

        <Col lg={4}>
          {field('image', 'Link ảnh *', { placeholder: 'https://...' })}
          <div className="border rounded p-2 text-center bg-body-tertiary">
            {imageOk ? (
              <Image src={values.image} alt="Xem trước" fluid rounded onError={handleImageError} />
            ) : (
              <div className="py-5 text-secondary small">Ảnh xem trước</div>
            )}
          </div>
        </Col>
      </Row>

      <div className="d-flex gap-2 mt-2">
        <Button type="submit" disabled={submitting}>
          {submitting && <Spinner size="sm" className="me-2" />}
          {submitText}
        </Button>
      </div>
    </Form>
  );
}
