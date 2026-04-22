import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} style={{ minHeight: 'calc(100vh - 320px)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
