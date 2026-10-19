import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, AlertTriangle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { listUsers, deleteUser } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

const UserListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete, error: errorDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  const confirmDelete = () => {
    if (deleteCandidate) {
      if (deleteCandidate._id === userInfo._id) {
        alert('You cannot delete your own active administrator account!');
        setDeleteCandidate(null);
        return;
      }
      dispatch(deleteUser(deleteCandidate._id));
      setDeleteCandidate(null);
    }
  };

  const filteredUsers = (users || []).filter((usr) => {
    const matchName = usr.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmail = usr.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchName || matchEmail;
  });

  return (
    <AdminLayout
      title="Member Directory"
      subtitle="Audit patron accounts, access credentials, and elevated administrative authorization tiers."
    >
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {/* Search Toolbar */}
      <div className="bg-white border border-sand/60 p-4 mb-6 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by patron name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-ivory/40 border border-sand pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-charcoal focus:bg-white transition"
          />
          <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <Loader text="Loading member directory from database..." />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="bg-white border border-sand/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand/60 bg-ivory/50 text-[10px] uppercase tracking-widest text-charcoal/60">
                  <th className="py-3.5 px-4 font-medium">Identifier</th>
                  <th className="py-3.5 px-4 font-medium">Name</th>
                  <th className="py-3.5 px-4 font-medium">Email</th>
                  <th className="py-3.5 px-4 font-medium">Privilege Tier</th>
                  <th className="py-3.5 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-charcoal/50 text-xs">
                      No member accounts match current search query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((usr) => (
                    <tr key={usr._id} className="hover:bg-sand/10 transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                        #{usr._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 font-serif text-sm text-charcoal font-medium">
                        {usr.name} {usr._id === userInfo._id && '(Current Session)'}
                      </td>
                      <td className="py-3.5 px-4 text-charcoal/70">
                        {usr.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {usr.isAdmin ? (
                          <span className="text-[10px] uppercase tracking-widest text-olive font-semibold bg-sand/30 px-2 py-0.5 border border-sand/60">
                            Administrator
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/50">
                            Patron
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/user/${usr._id}/edit`}
                            className="border border-sand hover:border-charcoal text-charcoal text-[11px] uppercase tracking-wider px-2.5 py-1 transition"
                            title="Edit Member"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteCandidate(usr)}
                            disabled={usr._id === userInfo._id}
                            className={`text-[11px] uppercase tracking-wider px-2.5 py-1 transition border ${
                              usr._id === userInfo._id
                                ? 'border-sand/40 text-charcoal/30 cursor-not-allowed'
                                : 'border-red-200 text-red-700 hover:bg-red-50'
                            }`}
                            title={usr._id === userInfo._id ? 'Cannot delete self' : 'Delete Member'}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-sand p-6 sm:p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center gap-3 text-red-700 mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif text-xl text-charcoal font-medium">
                Confirm Account Revocation
              </h3>
            </div>
            <p className="text-xs text-charcoal/70 leading-relaxed mb-6 font-light">
              Are you certain you wish to remove member profile &ldquo;{deleteCandidate.name}&rdquo; ({deleteCandidate.email}) from the platform? This will revoke access to all historical transactions.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="border border-sand hover:border-charcoal px-4 py-2 text-xs uppercase tracking-wider text-charcoal transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 text-xs uppercase tracking-wider transition"
              >
                Revoke Account
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserListPage;
