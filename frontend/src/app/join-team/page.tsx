'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function JoinTeamPage() {
  const [teamId, setTeamId] = useState('');

  const handleJoin = async () => {
    const user_id = localStorage.getItem('user_id');
    const res = await fetch('http://127.0.0.1:5000/api/team/add-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, team_id: teamId }),
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <>
    <Navbar />
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Join a Team</h1>
      <input
        type="text"
        placeholder="Team ID"
        className="border p-2 w-full mb-4"
        onChange={(e) => setTeamId(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2" onClick={handleJoin}>
        Join
      </button>
    </div>
    </>
  );
}
