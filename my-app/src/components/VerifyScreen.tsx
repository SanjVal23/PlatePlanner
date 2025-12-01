import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function VerifyScreen() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!token) return setMessage('Missing verification token');
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5050/api/auth/verify/${token}`);
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Verification failed');
      } else {
        setMessage('Your email has been verified. You can now log in.');
      }
    } catch (err) {
      setMessage('Unable to contact server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
      <p className="text-gray-700 mb-6">Click the button below to confirm your email and activate your account.</p>

      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-purple-600 text-white py-3 rounded-xl shadow-lg mt-2 disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Verify Email'}
      </button>

      <button
        onClick={() => navigate('/login')}
        className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl shadow mt-4"
      >
        Go to Login
      </button>
    </div>
  );
}
