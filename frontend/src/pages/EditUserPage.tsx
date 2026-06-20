import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserById, updateUser, validateDocument } from '../api/users';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
  });

  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [panStatus, setPanStatus] = useState<{valid: boolean; exists: boolean} | null>(null);
  const [aadhaarStatus, setAadhaarStatus] = useState<{valid: boolean; exists: boolean} | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (user && !pan && !aadhaar) {
      setPan(user.pan);
      setAadhaar(user.aadhaar);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const payload: any = {};
      if (pan && pan !== user?.pan && pan.length >= 10) payload.pan = pan;
      if (aadhaar && aadhaar !== user?.aadhaar && aadhaar.length >= 12) payload.aadhaar = aadhaar;
      
      if (Object.keys(payload).length > 0) {
        setIsValidating(true);
        validateDocument(payload).then((res: any) => {
          if (payload.pan && res.data.pan) setPanStatus(res.data.pan);
          if (payload.aadhaar && res.data.aadhaar) setAadhaarStatus(res.data.aadhaar);
        }).catch(() => {}).finally(() => setIsValidating(false));
      } else {
        if (pan === user?.pan) setPanStatus(null);
        if (aadhaar === user?.aadhaar) setAadhaarStatus(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pan, aadhaar, user]);

  const mutation = useMutation({
    mutationFn: (data: any) => updateUser(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate('/');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'An error occurred');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    mutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h1>
      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" defaultValue={user.name} required minLength={3} maxLength={100} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" defaultValue={user.email} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Mobile</label>
            <input name="primaryMobile" defaultValue={user.primaryMobile} required pattern="^\d{10}$" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Mobile</label>
            <input name="secondaryMobile" defaultValue={user.secondaryMobile || ''} pattern="^\d{10}$" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar</label>
            <input 
              name="aadhaar" 
              required 
              value={aadhaar}
              onChange={(e) => {
                const val = e.target.value.replace(/\s+/g, '');
                setAadhaar(val);
                setAadhaarStatus(null);
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                aadhaarStatus && !aadhaarStatus.valid ? 'border-red-500' : 
                aadhaarStatus && aadhaarStatus.exists ? 'border-red-500' :
                aadhaarStatus?.valid ? 'border-green-500' : 'border-gray-200'
              }`} 
            />
            {aadhaarStatus && (
              <p className={`text-sm mt-1 ${aadhaarStatus.valid && !aadhaarStatus.exists ? 'text-green-600' : 'text-red-600'}`}>
                {aadhaarStatus.exists ? '✗ Aadhaar already exists' : 
                 !aadhaarStatus.valid ? '✗ Invalid Aadhaar' : '✓ Aadhaar is valid'}
              </p>
            )}
            {isValidating && <p className="text-sm mt-1 text-gray-500">Checking...</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
            <input 
              name="pan" 
              required 
              value={pan}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                setPan(val);
                setPanStatus(null);
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase ${
                panStatus && !panStatus.valid ? 'border-red-500' : 
                panStatus && panStatus.exists ? 'border-red-500' :
                panStatus?.valid ? 'border-green-500' : 'border-gray-200'
              }`} 
            />
            {panStatus && (
              <p className={`text-sm mt-1 ${panStatus.valid && !panStatus.exists ? 'text-green-600' : 'text-red-600'}`}>
                {panStatus.exists ? '✗ PAN already exists' : 
                 !panStatus.valid ? '✗ Invalid PAN format' : '✓ PAN is valid'}
              </p>
            )}
            {isValidating && <p className="text-sm mt-1 text-gray-500">Checking...</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input name="dateOfBirth" type="date" defaultValue={new Date(user.dateOfBirth).toISOString().split('T')[0]} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
            <input name="placeOfBirth" defaultValue={user.placeOfBirth} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
            <textarea name="currentAddress" defaultValue={user.currentAddress} required rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
            <textarea name="permanentAddress" defaultValue={user.permanentAddress} required rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={mutation.isPending || isValidating || (panStatus && (!panStatus.valid || panStatus.exists)) || (aadhaarStatus && (!aadhaarStatus.valid || aadhaarStatus.exists))} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
