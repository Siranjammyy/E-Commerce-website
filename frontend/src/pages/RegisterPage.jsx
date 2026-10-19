import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import { register } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const rawRedirect = queryParams.get('redirect');
  const redirect = rawRedirect ? (rawRedirect.startsWith('/') ? rawRedirect : `/${rawRedirect}`) : '/';

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
    } else {
      setMessage(null);
      dispatch(register(name, email, password));
    }
  };

  return (
    <div className="bg-canvas min-h-[calc(100vh-200px)] py-12 sm:py-20 flex items-center justify-center">
      <div className="w-full max-w-md mx-4 bg-white border border-sand/60 p-8 sm:p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-4 h-px bg-olive"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
              Registry Enrollment
            </span>
          </div>
          <h1 className="font-serif text-3xl text-charcoal font-normal">
            Join VERO
          </h1>
          <p className="text-xs text-charcoal/60 mt-1 font-light">
            Create an account to track orders, view receipts, and maintain delivery preferences.
          </p>
        </div>

        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader size="sm" text="Recording profile..." />}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
              Full Name *
            </label>
            <input
              type="text"
              className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
              placeholder="e.g. Helena Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
              Confirm Password *
            </label>
            <input
              type="password"
              className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-4 font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Enroll Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-sand/40 text-center text-xs text-charcoal/60">
          <span>Already registered? </span>
          <Link
            to={redirect ? `/login?redirect=${redirect.replace('/', '')}` : '/login'}
            className="text-olive hover:underline font-medium"
          >
            Authenticate Existing Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
