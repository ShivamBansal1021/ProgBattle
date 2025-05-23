'use client'
import { useState } from 'react';
import { redirect } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    const res = await fetch('http://127.0.0.1:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) redirect('/login');
    else alert('Registration failed');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <input type="email" placeholder="Email" className="border w-full mb-2 p-2"
          onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border w-full mb-4 p-2"
          onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2" onClick={register}>Register</button>
      </div>
    </>
  );
}
