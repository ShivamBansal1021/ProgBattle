'use client'
import { useState } from 'react';
import { redirect } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const res = await fetch('http://127.0.0.1:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user_id', data.user_id);
      redirect('/dashboard');
    } else alert('Login failed');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <input type="email" placeholder="Email" className="border w-full mb-2 p-2"
          onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border w-full mb-4 p-2"
          onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2" onClick={login}>Login</button>
      </div>
    </>
  );
}
