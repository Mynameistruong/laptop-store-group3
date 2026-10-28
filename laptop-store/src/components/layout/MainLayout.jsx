import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <>
      <AppNavbar />
      <main className="container py-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
