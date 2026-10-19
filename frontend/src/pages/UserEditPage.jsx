import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';
import Message from '../components/Message';
import Loader from '../components/Loader';

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate('/admin/userlist');
    }
  }, [navigate, successUpdate, userInfo, dispatch]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!user || !user.name || user._id !== id) {
        dispatch(getUserDetails(id));
      }
    }
  }, [dispatch, id, user, userInfo]);

  const [loadedId, setLoadedId] = useState(null);

  if (user && user._id === id && loadedId !== id) {
    setLoadedId(id);
    setName(user.name || '');
    setEmail(user.email || '');
    setIsAdmin(Boolean(user.isAdmin));
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: id, name, email, isAdmin }));
  };

  return (
    <AdminLayout
      title="Member Privilege Assignment"
      subtitle={`Configure identity details and elevated administrative rights for account #${id.slice(-6).toUpperCase()}.`}
      actions={
        <Link
          to="/admin/userlist"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal transition border border-sand px-4 py-2.5 bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Directory</span>
        </Link>
      }
    >
      <div className="max-w-xl">
        <div className="bg-white border border-sand/60 p-8 sm:p-10 shadow-sm">
          {loadingUpdate && <Loader size="sm" text="Updating member permissions in database..." />}
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

          {loading ? (
            <div className="py-12">
              <Loader text="Loading member details..." />
            </div>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-charcoal/70 mb-2 font-medium">
                  Full Name *
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
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full bg-ivory/40 border border-sand px-4 py-3 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer p-4 border border-sand bg-ivory/40 hover:bg-white transition">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="mt-1 accent-[#2D4436]"
                  />
                  <div>
                    <span className="font-serif text-base text-charcoal block">
                      Grant Administrator Privileges
                    </span>
                    <span className="text-xs text-charcoal/60 mt-0.5 block font-light">
                      Enables full administrative authority to commission catalog artifacts, manage orders, and oversee member directories.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="w-full bg-charcoal hover:bg-olive text-ivory text-xs uppercase tracking-[0.2em] py-4 font-medium transition duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loadingUpdate ? 'Saving Updates...' : 'Commit Member Changes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserEditPage;
