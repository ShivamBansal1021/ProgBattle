'use client'
import { useState } from 'react';
import { redirect } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);

  const upload = async () => {
    if (!file) return alert('Select a file');
    const formData = new FormData();
    formData.append('bot', file);
    formData.append('user_id', localStorage.getItem('user_id') || '');

    const res = await fetch('http://127.0.0.1:5000/api/bot/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message||'Bot uploaded!');
      redirect('/dashboard');
    } else {
      alert(data.error||'Upload failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Bot</h2>
        <input className="bg-blue-800 text-white" type="file" accept=".py" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="bg-blue-700 text-white px-4 py-2 mt-4" onClick={upload}>Save & Run Match</button>
      </div>
    </>
  );
}
