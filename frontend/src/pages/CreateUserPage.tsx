import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, validateDocument } from '../api/users';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, AtSign, IdCard, Home, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Card = ({ title, icon: Icon, children }: any) => (
  <div className="bg-white border border-pink-100 rounded-lg shadow-sm overflow-hidden mb-6 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
    <div className="bg-pink-50 border-b border-pink-100 px-6 py-4 flex items-center gap-3 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <div className="p-1.5 bg-pink-100 text-pink-600 rounded-md dark:bg-pink-900/30 dark:text-pink-400">
        <Icon size={20} />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

export default function CreateUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [panStatus, setPanStatus] = useState<{valid: boolean; exists: boolean} | null>(null);
  const [aadhaarStatus, setAadhaarStatus] = useState<{valid: boolean; exists: boolean} | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Addresses
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [isSameAddress, setIsSameAddress] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const payload: any = {};
      if (pan.length >= 10) payload.pan = pan;
      if (aadhaar.length >= 12) payload.aadhaar = aadhaar;
      
      if (Object.keys(payload).length > 0) {
        setIsValidating(true);
        validateDocument(payload).then((res: any) => {
          if (payload.pan && res.data.pan) setPanStatus(res.data.pan);
          if (payload.aadhaar && res.data.aadhaar) setAadhaarStatus(res.data.aadhaar);
        }).catch(() => {}).finally(() => setIsValidating(false));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pan, aadhaar]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSameAddress(checked);
    if (checked) {
      setPermanentAddress(currentAddress);
    }
  };

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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

  const isSubmitDisabled = Boolean(mutation.isPending || isValidating || 
    (panStatus && (!panStatus.valid || panStatus.exists)) || 
    (aadhaarStatus && (!aadhaarStatus.valid || aadhaarStatus.exists)));

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Launch a new user into orbit.</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Everything needed to welcome a new employee—organized in one place.</p>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 dark:bg-red-900/30 dark:text-red-400"><AlertCircle size={20} /> {error}</div>}

        <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
          
          <Card title="Personal Snapshot" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-300">Full Name <span className="text-red-500">*</span></label>
                <input name="name" required minLength={3} maxLength={100} placeholder="e.g. Vikash Kumar" className="w-full px-4 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-pink-400 dark:focus:border-pink-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-300">Date of Birth <span className="text-red-500">*</span></label>
                <input name="dateOfBirth" type="date" required onClick={(e) => (e.target as HTMLInputElement).showPicker()} className="w-full px-4 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-pink-400 dark:focus:border-pink-400 [color-scheme:light] dark:[color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-300">Place of Birth <span className="text-red-500">*</span></label>
                <input name="placeOfBirth" required placeholder="Tell us in which City, Country the magic happens..." className="w-full px-4 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-pink-400 dark:focus:border-pink-400" />
              </div>
            </div>
          </Card>

          <Card title="Contact Hub" icon={AtSign}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
                <input name="email" type="email" required placeholder="vikash.kumar@gmail.com" className="w-full px-4 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-pink-400 dark:focus:border-pink-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-300">Primary Mobile <span className="text-red-500">*</span></label>
                <input name="primaryMobile" required pattern="^\d{10}$" placeholder="+91 9876543210" className="w-full px-4 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-pink-400 dark:focus:border-pink-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-300">Secondary Mobile <span className="text-gray-400 font-normal dark:text-gray-500">(Optional)</span></label>
                <input name="secondaryMobile" pattern="^\d{10}$" placeholder="+91 9876543210" className="w-full px-4 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-pink-400 dark:focus:border-pink-400" />
              </div>
            </div>
          </Card>

          <Card title="Identity Records" icon={IdCard}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-300">Aadhaar / National ID <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="aadhaar" 
                  required 
                  placeholder="1234 5678 9012"
                  value={aadhaar.replace(/(\d{4})(?=\d)/g, '$1 ').trim()}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s/g, '');
                    if (/^\d*$/.test(val) && val.length <= 12) {
                      setAadhaar(val);
                      setAadhaarStatus(null);
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow dark:text-gray-100 ${aadhaarStatus ? (aadhaarStatus.valid && !aadhaarStatus.exists ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-pink-200 dark:border-gray-600 dark:bg-gray-700'}`}
                />
                {aadhaarStatus && (
                  <div className={`text-sm mt-1 flex items-center gap-1 ${aadhaarStatus.valid && !aadhaarStatus.exists ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {aadhaarStatus.valid && !aadhaarStatus.exists ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {aadhaarStatus.exists ? 'Aadhaar already registered' : aadhaarStatus.valid ? '✓ Valid Aadhaar' : '✗ Invalid Aadhaar'}
                  </div>
                )}
                {isValidating && <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Checking...</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-300">PAN / Tax ID <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="pan" 
                  required 
                  placeholder="ABCDE1234F"
                  value={pan}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    if (val.length <= 10) {
                      setPan(val);
                      setPanStatus(null);
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow dark:text-gray-100 ${panStatus ? (panStatus.valid && !panStatus.exists ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20') : 'border-pink-200 dark:border-gray-600 dark:bg-gray-700'}`}
                />
                {panStatus && (
                  <div className={`text-sm mt-1 flex items-center gap-1 ${panStatus.valid && !panStatus.exists ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {panStatus.valid && !panStatus.exists ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {panStatus.exists ? 'PAN already registered' : panStatus.valid ? '✓ Valid PAN' : '✗ Invalid PAN'}
                  </div>
                )}
                {isValidating && <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Checking...</p>}
              </div>
            </div>
          </Card>

          <Card title="Address Details" icon={Home}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-gray-300">Current Residence <span className="text-red-500">*</span></label>
                <textarea 
                  name="currentAddress" 
                  required 
                  rows={3} 
                  placeholder="Your current coordinates on Earth..."
                  value={currentAddress}
                  onChange={(e) => {
                    setCurrentAddress(e.target.value);
                    if (isSameAddress) setPermanentAddress(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-pink-400 dark:focus:border-pink-400"
                ></textarea>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Permanent Residence <span className="text-red-500">*</span></label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer dark:text-gray-400">
                    <input type="checkbox" checked={isSameAddress} onChange={handleCheckboxChange} className="rounded border-pink-200 text-pink-600 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700" />
                    Same as current
                  </label>
                </div>
                <textarea 
                  name="permanentAddress" 
                  required 
                  rows={3} 
                  placeholder="Tell us where the magic happens..."
                  value={permanentAddress}
                  onChange={(e) => {
                    setPermanentAddress(e.target.value);
                    if (isSameAddress && e.target.value !== currentAddress) setIsSameAddress(false);
                  }}
                  className={`w-full px-4 py-2 border border-pink-200 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-shadow dark:text-gray-100 dark:border-gray-600 dark:focus:ring-pink-400 dark:focus:border-pink-400 ${isSameAddress ? 'bg-pink-50 dark:bg-gray-800' : 'dark:bg-gray-700'}`}
                ></textarea>
              </div>
            </div>
          </Card>

          {/* Bottom Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 border border-pink-200 text-gray-700 bg-white rounded-lg hover:bg-pink-50 font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={isSubmitDisabled} className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0">
              {mutation.isPending ? 'Saving...' : 'Create User'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
