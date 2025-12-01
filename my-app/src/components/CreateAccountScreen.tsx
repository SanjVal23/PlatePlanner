import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface CreateAccountScreenProps {
  onNavigate: (screen: any) => void;
}

export function CreateAccountScreen({ onNavigate }: CreateAccountScreenProps) {
  const { setUser } = useApp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

const handleCreateAccount = async () => {
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);
    setErrorMessage(null);
    const response = await fetch("http://localhost:5050/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      })
    });
    const text = await response.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch (e) { data = { message: text }; }

    if (!response.ok) {
      const msg = data.error || data.message || 'Account creation failed';
      throw new Error(msg);
    }

    // If backend returned an Ethereal preview URL (dev), save it so CheckEmailScreen can show it
    if (data.previewUrl) {
      try { localStorage.setItem('emailPreviewUrl', data.previewUrl); } catch (e) { /* ignore */ }
    } else {
      try { localStorage.removeItem('emailPreviewUrl'); } catch (e) { /* ignore */ }
    }

    // Do not auto-login. Prompt user to check their email for verification link.
    onNavigate("check-email");

  } catch (error: any) {
    console.error('Register error:', error);
    // Network error (server unreachable) often gives 'Failed to fetch'
    if (error.message && error.message.toLowerCase().includes('failed to fetch')) {
      setErrorMessage('Cannot reach backend. Make sure the backend server is running at http://localhost:5050');
    } else {
      setErrorMessage(error.message || 'Account creation failed');
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <button 
        onClick={() => onNavigate('welcome')}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      
      <div className="flex flex-col items-center text-center space-y-6 mb-8">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <Logo size="md" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-gray-900">Create Account</h2>
          <p className="text-gray-500">Join Plate Planner today</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm text-gray-700">First Name</label>
            <input 
              id="firstName"
              type="text" 
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm text-gray-700">Last Name</label>
            <input 
              id="lastName"
              type="text" 
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-gray-700">Email</label>
          <input 
            id="email"
            type="email" 
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm text-gray-700">Username</label>
          <input 
            id="username"
            type="text" 
            placeholder="johndoe"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm text-gray-700">Password</label>
          <input 
            id="password"
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      {errorMessage && (
        <div className="mt-4 text-sm text-red-600">{errorMessage}</div>
      )}

      <button
        onClick={handleCreateAccount}
        disabled={loading}
        className={`w-full ${loading ? 'opacity-60' : ''} bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-6 rounded-xl shadow-lg mt-6 transition-colors`}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
      
      <div className="text-center mt-6 text-sm text-gray-600">
        Already have an account?{' '}
        <button 
          onClick={() => onNavigate('login')}
          className="text-purple-600 hover:text-purple-700"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}