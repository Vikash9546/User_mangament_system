import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, restoreUser, hardDeleteUser } from '../api/users';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, Edit, Trash2, RotateCcw, Plus, AlertTriangle } from 'lucide-react';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [confirmAction, setConfirmAction] = useState<{type: 'delete'|'restore'|'hard-delete', id: string, name: string} | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['users', search, status],
    queryFn: ({ pageParam }) => getUsers({ pageParam, limit: 10, search, status }),
    getNextPageParam: (lastPage) => lastPage.pagination.hasMore ? lastPage.pagination.nextCursor : undefined,
    initialPageParam: undefined,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User restored successfully');
    },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: hardDeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User permanently deleted');
    },
  });

  if (isLoading) return <div className="p-8 text-center font-bold text-lg animate-color-blink">Deployed on render free tier it's take few sec Loading users Please wait...</div>;

  const users = data?.pages.flatMap(page => page.data) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Users</h1>
        <Link to="/users/new" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95">
          <Plus className="w-5 h-5 mr-2" />
          Add New User
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, PAN..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-pink-400 transition-colors duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-pink-400 transition-colors duration-300"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="active">Active Users</option>
          <option value="deleted">Deleted Users</option>
          <option value="all">All Users</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 transition-colors duration-300">
                <th className="p-4 font-medium">User Info</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user.id} onClick={() => navigate(`/users/${user.id}`)} className="hover:bg-pink-50 transition-colors cursor-pointer dark:hover:bg-gray-700">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold mr-3 dark:bg-pink-900/30 dark:text-pink-400">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm dark:text-gray-400">{user.primaryMobile}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isDeleted ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {user.isDeleted ? 'Deleted' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/users/${user.id}/edit`} onClick={(e) => e.stopPropagation()} className="p-2 text-gray-400 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition-all duration-200 hover:scale-110 active:scale-95">
                        <Edit className="w-5 h-5" />
                      </Link>
                      {user.isDeleted ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'restore', id: user.id, name: user.name }); }} className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 hover:scale-110 active:scale-95" title="Restore User">
                            <RotateCcw className="w-5 h-5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'hard-delete', id: user.id, name: user.name }); }} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95" title="Delete Permanently">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); setConfirmAction({ type: 'delete', id: user.id, name: user.name }); }} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95" title="Delete User">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {hasNextPage && (
          <div className="p-4 border-t border-gray-100 flex justify-center dark:border-gray-700 transition-colors duration-300">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-pink-50 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAction(null)}>
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 transform transition-all dark:bg-gray-800" onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4 ${confirmAction.type === 'delete' || confirmAction.type === 'hard-delete' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
              {confirmAction.type === 'delete' || confirmAction.type === 'hard-delete' ? <AlertTriangle className="w-6 h-6" /> : <RotateCcw className="w-6 h-6" />}
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2 dark:text-gray-100">
              {confirmAction.type === 'delete' ? 'Delete User' : confirmAction.type === 'hard-delete' ? 'Permanently Delete User' : 'Restore User'}
            </h3>
            {confirmAction.type === 'delete' ? (
              <div className="text-center text-gray-600 mb-6 space-y-3 dark:text-gray-400">
                <p>Looks like it's time to part ways with <strong>{confirmAction.name}</strong>.</p>
                <p>Deleting this profile will remove users records and associated access from the system.</p>
                <p>Are you sure you want to continue?</p>
              </div>
            ) : confirmAction.type === 'restore' ? (
              <div className="text-center text-gray-600 mb-6 space-y-3 dark:text-gray-400">
                <p>Looks like <strong>{confirmAction.name}</strong> is making a comeback!</p>
                <p>Restoring this profile will reactivate their records and grant them access to the system again.</p>
                <p>Are you ready to welcome them back?</p>
              </div>
            ) : (
              <p className="text-center text-gray-600 mb-6 dark:text-gray-400">
                Are you sure you want to permanently delete <strong>{confirmAction.name}</strong>?
                This action cannot be undone.
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-pink-100/50 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === 'delete') {
                    deleteMutation.mutate(confirmAction.id);
                  } else if (confirmAction.type === 'hard-delete') {
                    hardDeleteMutation.mutate(confirmAction.id);
                  } else {
                    restoreMutation.mutate(confirmAction.id);
                  }
                  setConfirmAction(null);
                }}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 font-medium ${
                  confirmAction.type === 'delete' || confirmAction.type === 'hard-delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Confirm {confirmAction.type === 'hard-delete' ? 'Delete' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
