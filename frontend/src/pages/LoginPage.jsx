import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import { login, logout } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const rawRedirect = queryParams.get('redirect');
  const redirect = rawRedirect ? (rawRedirect.startsWith('/') ? rawRedirect : `/${rawRedirect}`) : '/';

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(login(demoEmail, demoPassword));
  };

  useEffect(() => {
    if (userInfo && !error) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect, error]);

  return (
    <div className="bg-canvas min-h-[calc(100vh-200px)] py-12 sm:py-20 flex items-center justify-center">
      <div className="w-full max-w-md mx-4 bg-white border border-sand/60 p-8 sm:p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-4 h-px bg-olive"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
              Client Portal
            </span>
          </div>
          <h1 className="font-serif text-3xl text-charcoal font-normal">
            Sign In to VERO
          </h1>
          <p className="text-xs text-charcoal/60 mt-1 font-light">
            Access your orders, saved addresses, and express checkout.
          </p>
        </div>

        {userInfo && (
          <div className="bg-sand/30 border border-sand p-4 mb-6 text-center">
            <span className="text-[10px] uppercase tracking-widest text-olive font-semibold block mb-1">
              Currently Authenticated
            </span>
            <p className="text-xs text-charcoal font-medium">
              {userInfo.name} ({userInfo.email}) &bull; {userInfo.isAdmin ? 'Administrator' : 'Client'}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Link
                to={userInfo.isAdmin ? '/admin' : redirect}
                className="bg-charcoal text-ivory text-[10px] uppercase tracking-wider px-3 py-1.5 font-medium hover:bg-olive transition"
              >
                Proceed
              </Link>
              <button
                type="button"
                onClick={() => dispatch(logout())}
                className="border border-sand hover:border-charcoal text-charcoal text-[10px] uppercase tracking-wider px-3 py-1.5 transition"
              >
                Switch Account
              </button>
            </div>
          </div>
        )}

        {/* 1-Click Evaluation Credentials for Quick Review */}
        <div className="bg-ivory/70 border border-sand/80 p-4 mb-6">
          <span className="text-[10px] uppercase tracking-widest text-olive font-semibold block mb-2">
            Evaluation Passcodes (1-Click Fill)
          </span>
          <div className="grid grid-cols-2 gap-2 text-left">
            <button
              type="button"
              onClick={() => handleFillDemo('john@example.com', 'password123')}
              className="bg-white border border-sand hover:border-charcoal p-2.5 transition text-left"
            >
              <span className="text-xs font-serif text-charcoal block">Client Access</span>
              <span className="text-[10px] text-charcoal/50 font-mono block">john@example.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@example.com', 'password123')}
              className="bg-white border border-sand hover:border-charcoal p-2.5 transition text-left"
            >
              <span className="text-xs font-serif text-charcoal block">Admin Access</span>
              <span className="text-[10px] text-charcoal/50 font-mono block">admin@example.com</span>
            </button>
          </div>
        </div>

        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader size="sm" text="Verifying credentials..." />}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
              Email Address *
            </label>
            <input
              type="email"
              className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
              placeholder="e.g. client@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
              Password *
            </label>
            <input
              type="password"
              className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-4 font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Authenticate Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-sand/40 text-center text-xs text-charcoal/60">
          <span>First-time visitor? </span>
          <Link
            to={redirect ? `/register?redirect=${redirect.replace('/', '')}` : '/register'}
            className="text-olive hover:underline font-medium"
          >
            Create a VERO Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
