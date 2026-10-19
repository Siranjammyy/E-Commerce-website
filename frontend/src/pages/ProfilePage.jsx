import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package,
  CheckCircle2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      }
    }
  }, [dispatch, navigate, userInfo, user, success]);

  const [loadedUserId, setLoadedUserId] = useState(null);

  if (user && user._id && loadedUserId !== user._id) {
    setLoadedUserId(user._id);
    setName(user.name || '');
    setEmail(user.email || '');
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setMessage(null);
      dispatch(updateUserProfile({ id: user._id, name, email, password: password || undefined }));
    }
  };

  return (
    <div className="bg-canvas min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 mb-8 border-b border-sand/60">
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="w-4 h-px bg-olive"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-olive font-semibold">
              Client Portal
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Account & Acquisitions
          </h1>
          <p className="text-xs text-charcoal/60 mt-1 font-light">
            Manage your personal profile, credentials, and archived acquisition history.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Account Credentials */}
          <div className="lg:col-span-4 bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl text-charcoal pb-4 mb-6 border-b border-sand/40">
              Personal Information
            </h2>

            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {success && <Message variant="success">Account credentials updated successfully</Message>}
            {loading && <Loader size="sm" text="Saving updates..." />}

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 border-t border-sand/40">
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave empty to retain current"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-3.5 font-medium transition duration-300"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order History Archive */}
          <div className="lg:col-span-8 bg-white border border-sand/60 p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl text-charcoal pb-4 mb-6 border-b border-sand/40">
              Acquisition History
            </h2>

            {loadingOrders ? (
              <div className="py-12">
                <Loader text="Retrieving personal ledger..." />
              </div>
            ) : errorOrders ? (
              <Message variant="danger">{errorOrders}</Message>
            ) : orders && orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-10 h-10 text-sand mx-auto mb-3" />
                <p className="font-serif text-lg text-charcoal mb-1">No Orders Recorded</p>
                <p className="text-xs text-charcoal/60 mb-6 font-light">
                  Your acquisition ledger is currently empty.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-charcoal text-ivory text-xs uppercase tracking-widest px-6 py-3 font-medium hover:bg-olive transition"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-sand/60 text-[10px] uppercase tracking-widest text-charcoal/50 pb-3">
                      <th className="pb-3 font-medium">Reference</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Balance</th>
                      <th className="pb-3 font-medium">Settlement</th>
                      <th className="pb-3 font-medium">Courier</th>
                      <th className="pb-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/40 font-light text-charcoal">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-sand/10 transition">
                        <td className="py-4 font-mono font-medium text-charcoal">
                          #{ord._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-4 text-charcoal/70">
                          {new Date(ord.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 font-mono font-medium text-charcoal">
                          ${Number(ord.totalPrice).toFixed(2)}
                        </td>
                        <td className="py-4">
                          {ord.isPaid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-800 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Settled</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-800 font-medium">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Pending</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          {ord.isDelivered ? (
                            <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-medium">
                              Delivered
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-medium">
                              Processing
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <Link
                            to={`/order/${ord._id}`}
                            className="inline-block border border-sand hover:border-charcoal text-charcoal text-[11px] uppercase tracking-wider px-3 py-1 font-medium transition"
                          >
                            Receipt
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
