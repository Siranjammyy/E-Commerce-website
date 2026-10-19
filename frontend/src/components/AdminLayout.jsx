import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { logout } from '../actions/userActions';

const AdminLayout = ({ title, subtitle, children, actions }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    {
      name: 'Overview',
      path: '/admin',
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      name: 'Catalog Inventory',
      path: '/admin/productlist',
      icon: <Package className="w-4 h-4" />,
    },
    {
      name: 'Transactions & Orders',
      path: '/admin/orderlist',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      name: 'Member Directory',
      path: '/admin/userlist',
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="bg-canvas min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-sand/60 md:min-h-screen shrink-0 flex flex-col justify-between">
        <div>
          {/* Admin Header / Logo */}
          <div className="p-6 border-b border-sand/40">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-4 h-px bg-olive"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
                Backoffice
              </span>
            </div>
            <Link to="/admin" className="font-serif text-2xl text-charcoal tracking-tight block">
              VERO <span className="text-olive italic font-normal text-xl">Admin</span>
            </Link>
            <span className="text-[11px] text-charcoal/50 mt-1 block font-mono">
              Role: Master Administrator
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs uppercase tracking-wider font-medium transition duration-200 border-l-2 ${
                    active
                      ? 'border-olive bg-ivory/60 text-charcoal font-semibold'
                      : 'border-transparent text-charcoal/60 hover:text-charcoal hover:bg-sand/10'
                  }`}
                >
                  <span className={active ? 'text-olive' : 'text-charcoal/40'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-sand/40 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2.5 text-xs text-charcoal/70 hover:text-charcoal hover:bg-ivory transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-olive" />
              <span>Public Storefront</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-charcoal/40">&rarr;</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-red-700/80 hover:text-red-700 hover:bg-red-50/50 transition text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-sand/60 px-6 sm:px-10 py-5 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-olive font-semibold mb-1">
              <span>Admin Center</span>
              <span>/</span>
              <span>{title || 'Dashboard'}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-charcoal/60 mt-0.5 font-light">
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </header>

        {/* Body Content */}
        <main className="p-6 sm:p-10 flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
