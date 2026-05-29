import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export const AppLayout = () => (
  <div className="app-shell">
    <TopNav />
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);
