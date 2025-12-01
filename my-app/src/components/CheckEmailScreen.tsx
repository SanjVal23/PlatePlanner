import React from 'react';

interface CheckEmailProps {
  onNavigate: (screen: any) => void;
}

export function CheckEmailScreen({ onNavigate }: CheckEmailProps) {
  const previewUrl = typeof window !== 'undefined' ? localStorage.getItem('emailPreviewUrl') : null;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <h2 className="text-2xl font-semibold mb-4">Almost there</h2>
      <p className="text-gray-700 mb-6">We sent you a verification email. Please check your inbox and click the verification link to activate your account.</p>
      <p className="text-sm text-gray-500 mb-4">If you don't see the email, check your spam folder.</p>

      {previewUrl && (
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">Development preview link (Ethereal):</p>
          <a href={previewUrl} target="_blank" rel="noreferrer" className="text-purple-600 underline">Open preview email</a>
        </div>
      )}

      <button
        onClick={() => onNavigate('welcome')}
        className="w-full bg-purple-600 text-white py-3 rounded-xl shadow-lg mt-2"
      >
        Back to welcome
      </button>
    </div>
  );
}
