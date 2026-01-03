'use client';
import { useState } from 'react';

export default function VerifyOtpPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const verify = async () => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-xl font-bold">Verify Your Email</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter OTP"
        className="border p-2 rounded"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verify} className="bg-blue-600 text-white px-4 py-2 rounded">
        Verify
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
