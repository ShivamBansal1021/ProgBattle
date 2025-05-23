'use client'

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        redirect('/login');
      }

      const res = await fetch(`http://127.0.0.1:5000/api/user?user_id=${userId}`);
      const data = await res.json();
      setUser(data);
    };

    fetchData();
  }, []);

  const createTeam = async () => {
    const userId = localStorage.getItem('user_id');
    const res = await fetch('http://127.0.0.1:5000/api/team/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, team_name: teamName })
    });
    if (res.ok) window.location.reload();
    else alert('Failed to create team');
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        {user && (
          <>
            <p>Email: {user.email}</p>
            <p>Team: {user.team || 'No team'}</p>

            {!user.team && (
              <div className="mt-4">Create New Team &nbsp;&nbsp;
                <input className="border p-2 mr-2" placeholder="Team Name"
                  onChange={e => setTeamName(e.target.value)} />
                <button className="bg-blue-600 text-white px-4 py-2" onClick={createTeam}>
                  Create Team
                </button>
                <p><br/>or</p>
              </div>
            )}
            {!user.team && (
              <div className="mt-4"> 
                <button
                  className="bg-indigo-600 text-white px-4 py-2"
                  onClick={() => redirect('/join-team')}
                >
                  Join a Team
                </button>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => redirect('/code-editor')}
                className="bg-blue-600 text-white px-4 py-2"
              >
                Submit New Code
              </button>
              <button className="bg-green-600 text-white px-4 py-2" onClick={() => redirect('/upload')}>
                Upload Bot
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
