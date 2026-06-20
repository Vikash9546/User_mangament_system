import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../api/users';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <div className="p-8 text-center text-red-500">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 transition-all duration-200 hover:-translate-x-1">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <Link to={`/users/${user.id}/edit`} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95">
          <Edit className="w-4 h-4 mr-2" />
          Edit User
        </Link>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-start justify-between border-b border-gray-100 pb-6 mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mr-6">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
                {user.isDeleted && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Deleted</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Primary Mobile</p>
                <p className="font-medium">{user.primaryMobile}</p>
              </div>
              {user.secondaryMobile && (
                <div>
                  <p className="text-sm text-gray-500">Secondary Mobile</p>
                  <p className="font-medium">{user.secondaryMobile}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Identity Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Aadhaar Number</p>
                <p className="font-medium tracking-wider">{user.aadhaar}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PAN Number</p>
                <p className="font-medium tracking-wider uppercase">{user.pan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Place of Birth</p>
                <p className="font-medium">{user.placeOfBirth}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Address</p>
                <p className="font-medium whitespace-pre-wrap">{user.currentAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Permanent Address</p>
                <p className="font-medium whitespace-pre-wrap">{user.permanentAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
