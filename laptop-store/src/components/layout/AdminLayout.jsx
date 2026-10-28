import { NavLink, Outlet } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

export default function AdminLayout() {
  return (
    <div className="container py-4">
      <div className="row g-4">
        <aside className="col-lg-2">
          <Nav variant="pills" className="flex-column bg-light p-3 rounded-3">
            <Nav.Link as={NavLink} to="/admin/laptops">Laptop</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/orders">Đơn hàng</Nav.Link>
          </Nav>
        </aside>
        <div className="col-lg-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
