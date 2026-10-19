import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  LogOut,
  Package,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { logout } from '../actions/userActions';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(keyword.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    } else {
      navigate('/');
    }
  };

  const navCategories = [
    { label: 'Acoustics', category: 'Audio' },
    { label: 'Workspace', category: 'Electronics' },
    { label: 'Optics', category: 'Cameras' },
    { label: 'Gaming', category: 'Gaming' },
  ];

  return (
    <header className="bg-[#FAF8F5] border-b border-[#EAE4D8] sticky top-0 z-50">
      {/* Slim Editorial Announcement Bar */}
      <div className="bg-[#2D4436] text-[#FAF8F5] text-[11px] tracking-[0.14em] uppercase py-2 px-4 text-center font-medium border-b border-[#24372C]">
        <span>Complimentary Express Delivery on Curated Orders Over $100</span>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#181816] hover:text-[#2D4436] transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Wordmark */}
          <Link
            to="/"
            className="flex flex-col items-center md:items-start group transition"
          >
            <span className="font-serif text-2xl sm:text-3xl font-medium tracking-[0.22em] text-[#181816] group-hover:text-[#2D4436] transition-colors uppercase">
              VERO
            </span>
            <span className="text-[9px] tracking-[0.28em] uppercase text-[#7D7E77] -mt-1 hidden sm:block font-medium">
              Tech &bull; Living
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs tracking-[0.12em] font-medium text-[#4A4B46]">
            <Link
              to="/"
              className="hover:text-[#2D4436] transition-colors py-1 relative uppercase"
            >
              The Collection
            </Link>
            {navCategories.map((item) => (
              <Link
                key={item.category}
                to={`/?category=${encodeURIComponent(item.category)}`}
                className="hover:text-[#2D4436] transition-colors py-1 uppercase"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons: Search, Account, Cart */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[#181816]">
            {/* Search Toggle / Form */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={searchSubmitHandler}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border border-[#DDD6C8] rounded-sm shadow-card pl-3 pr-2 py-1 w-64 z-20"
                >
                  <input
                    type="text"
                    placeholder="Search objects..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full text-xs text-[#181816] placeholder-[#9A988F] bg-transparent focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1 text-[#2D4436] hover:opacity-80 transition"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-[#7D7E77] hover:text-[#181816] transition ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-1.5 hover:text-[#2D4436] transition"
                  title="Search catalog"
                  aria-label="Search catalog"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Account Menu */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 text-xs font-medium tracking-wide hover:text-[#2D4436] transition py-1"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {userInfo.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#7D7E77]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-[#FFFFFF] border border-[#EAE4D8] rounded-sm shadow-card py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-[#F2EEE7] text-[#7D7E77]">
                      <span className="block text-[10px] uppercase tracking-wider">Signed in as</span>
                      <strong className="text-[#181816] font-semibold truncate block text-xs">
                        {userInfo.name}
                      </strong>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-[#4A4B46] hover:bg-[#FAF8F5] hover:text-[#2D4436] transition"
                    >
                      <UserIcon className="w-3.5 h-3.5 mr-2" />
                      <span>Account Profile</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-[#4A4B46] hover:bg-[#FAF8F5] hover:text-[#2D4436] transition"
                    >
                      <Package className="w-3.5 h-3.5 mr-2" />
                      <span>My Orders</span>
                    </Link>

                    {userInfo.isAdmin && (
                      <>
                        <div className="border-t border-[#F2EEE7] my-1" />
                        <div className="px-4 py-1 text-[10px] uppercase tracking-wider text-[#2D4436] font-bold">
                          Admin Center
                        </div>
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-1.5 text-[#4A4B46] hover:bg-[#FAF8F5] hover:text-[#2D4436] transition font-medium"
                        >
                          <span>Executive Overview</span>
                        </Link>
                        <Link
                          to="/admin/productlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-1.5 text-[#4A4B46] hover:bg-[#FAF8F5] hover:text-[#2D4436] transition"
                        >
                          <span>Manage Products</span>
                        </Link>
                        <Link
                          to="/admin/orderlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-1.5 text-[#4A4B46] hover:bg-[#FAF8F5] hover:text-[#2D4436] transition"
                        >
                          <span>Manage Orders</span>
                        </Link>
                        <Link
                          to="/admin/userlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-1.5 text-[#4A4B46] hover:bg-[#FAF8F5] hover:text-[#2D4436] transition"
                        >
                          <span>Manage Users</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-[#F2EEE7] my-1" />
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left flex items-center px-4 py-2 text-[#A65B44] hover:bg-[#FDF8F7] transition"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 text-xs uppercase tracking-[0.12em] font-medium text-[#181816] hover:text-[#2D4436] transition"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Shopping Cart Indicator */}
            <Link
              to="/cart"
              className="relative p-1.5 text-[#181816] hover:text-[#2D4436] transition flex items-center"
              aria-label="Shopping bag"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2D4436] text-[#FAF8F5] text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalCartQty}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#EAE4D8] animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-3 text-xs uppercase tracking-[0.15em] font-medium text-[#4A4B46]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#2D4436]"
              >
                The Collection
              </Link>
              {navCategories.map((item) => (
                <Link
                  key={item.category}
                  to={`/?category=${encodeURIComponent(item.category)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-[#2D4436]"
                >
                  {item.label}
                </Link>
              ))}
              {userInfo && userInfo.isAdmin && (
                <div className="pt-2 border-t border-[#EAE4D8] flex flex-col space-y-2">
                  <span className="text-[10px] text-[#2D4436] font-bold">Admin Management</span>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-[#2D4436] font-medium"
                  >
                    Executive Overview
                  </Link>
                  <Link
                    to="/admin/productlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-[#2D4436]"
                  >
                    Products Inventory
                  </Link>
                  <Link
                    to="/admin/orderlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-[#2D4436]"
                  >
                    Orders Fulfillment
                  </Link>
                  <Link
                    to="/admin/userlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-[#2D4436]"
                  >
                    User Accounts
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
