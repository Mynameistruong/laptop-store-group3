import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { laptopApi } from '../../api/laptopApi';
import { useToast } from '../../contexts/ToastContext';
import { formatDate, formatPrice } from '../../utils/format';

export default function AdminLaptopPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [laptops, setLaptops] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await laptopApi.getAll({ _page: page, _limit: 10, q: search || undefined });
      setLaptops(result.items);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search]);

  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, 'success');
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, showToast]);

  const handleQuickStock = async (id, stock) => {
    await laptopApi.patch(id, { stock: Number(stock) });
    await loadData();
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await laptopApi.remove(selectedId);
    setSelectedId(null);
    await loadData();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quản lý laptop</h3>
        <Button onClick={() => navigate('/admin/laptops/new')}>Thêm laptop</Button>
      </div>
      <Form.Control type="text" placeholder="Tìm laptop..." value={search} onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }} className="mb-3" />

      <Table responsive hover>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Ngày</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {laptops.map((laptop) => (
            <tr key={laptop.id}>
              <td><img src={laptop.image || '/no-image.svg'} alt={laptop.name} style={{ width: 54, height: 40, objectFit: 'cover' }} /></td>
              <td>{laptop.name}</td>
              <td>{formatPrice(laptop.salePrice ?? laptop.price)}</td>
              <td>
                <Form.Control
                  type="number"
                  value={laptop.stock}
                  onChange={(e) => handleQuickStock(laptop.id, e.target.value)}
                  className={laptop.stock < 5 ? 'border-danger' : ''}
                />
              </td>
              <td>{formatDate(laptop.createdAt)}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => navigate(`/admin/laptops/${laptop.id}/edit`)} className="me-2">Sửa</Button>
                <Button size="sm" variant="outline-danger" onClick={() => setSelectedId(laptop.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>Trang {page}</span>
        <div>
          <Button size="sm" variant="outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <Button size="sm" variant="outline-secondary" className="ms-2" disabled={page * 10 >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      <Modal show={!!selectedId} onHide={() => setSelectedId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn xóa laptop này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedId(null)}>Hủy</Button>
          <Button variant="danger" onClick={handleDelete}>Xóa</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
