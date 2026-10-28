import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import LaptopListPage from './pages/LaptopListPage';
import LaptopDetailPage from './pages/LaptopDetailPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderListPage from './pages/OrderListPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLaptopPage from './pages/admin/AdminLaptopPage';
import AdminLaptopFormPage from './pages/admin/AdminLaptopFormPage';
import AdminOrderPage from './pages/admin/AdminOrderPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="laptops" element={<LaptopListPage />} />
        <Route path="laptops/:id" element={<LaptopDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="laptops" replace />} />
        <Route path="laptops" element={<ProtectedRoute roles={['admin']}><AdminLaptopPage /></ProtectedRoute>} />
        <Route path="laptops/new" element={<ProtectedRoute roles={['admin']}><AdminLaptopFormPage /></ProtectedRoute>} />
        <Route path="laptops/:id/edit" element={<ProtectedRoute roles={['admin']}><AdminLaptopFormPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute roles={['admin']}><AdminOrderPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
