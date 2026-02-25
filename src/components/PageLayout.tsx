import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

/**
 * Layout wrapper for all main app routes. Renders the global Navigation (header/nav bar)
 * and the matched child route via <Outlet />. Do not remove Navigation or pages will
 * load with no header and appear broken.
 */
export default function PageLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname.split('/')[1] || 'home';
  const handleNavigate = (page: string) => navigate(`/${page}`);

  return (
    <>
      <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
      <Outlet />
    </>
  );
}
