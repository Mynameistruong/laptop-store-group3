import { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validate = (values) => {
    const next = {};
    if (!values.email) next.email = 'Email là bắt buộc';
    if (!values.password) next.password = 'Mật khẩu là bắt buộc';
    return next;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const next = { ...form, [name]: value };
    setForm(next);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await login(form.email, form.password);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="d-flex justify-content-center py-5">
      <Card style={{ width: 420 }} className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h3 className="mb-4 text-center">Đăng nhập</h3>
          <Form onSubmit={handleSubmit} noValidate>
            {submitError ? <Alert variant="danger">{submitError}</Alert> : null}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => setErrors((prev) => ({ ...prev, email: !form.email ? 'Email là bắt buộc' : '' }))}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => setErrors((prev) => ({ ...prev, password: !form.password ? 'Mật khẩu là bắt buộc' : '' }))}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? <><Spinner size="sm" className="me-2" /> Đang đăng nhập...</> : 'Đăng nhập'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
