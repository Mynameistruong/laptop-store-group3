import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import SearchSuggest from './SearchSuggest';

export default function AppNavbar() {
  const { user, isAdmin, logout } = useAuth();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          LaptopStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Trang chủ</Nav.Link>
            <Nav.Link as={NavLink} to="/laptops">Laptop</Nav.Link>
          </Nav>

          <div className="position-relative me-3 my-2 my-lg-0" style={{ minWidth: 220 }}>
            <SearchSuggest />
          </div>

          <Button as={Link} to="/cart" variant="outline-primary" className="position-relative me-3">
            🛒
            {totalQuantity > 0 ? (
              <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill">
                {totalQuantity}
              </Badge>
            ) : null}
          </Button>

          {!user ? (
            <Button as={Link} to="/login" state={{ from: location }} variant="primary">
              Đăng nhập
            </Button>
          ) : (
            <NavDropdown title={user.fullName || 'Tài khoản'} id="user-menu">
              <NavDropdown.Item as={Link} to="/orders">Đơn hàng của tôi</NavDropdown.Item>
              {isAdmin ? <NavDropdown.Item as={Link} to="/admin">Quản trị</NavDropdown.Item> : null}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
            </NavDropdown>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
