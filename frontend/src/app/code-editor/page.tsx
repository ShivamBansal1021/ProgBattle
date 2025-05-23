'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import { redirect, useRouter, useSearchParams } from 'next/navigation';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function CodeEditorPage() {
  const [code, setCode] = useState('');
  const [teamId, setTeamId] = useState('');
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return redirect('/login');

    fetch(`http://127.0.0.1:5000/api/user?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setTeamId(data.team);

        if (submissionId) {
          fetch(`http://127.0.0.1:5000/api/submission/${submissionId}`)
            .then(res => res.json())
            .then(data => setCode(data.code));
        } else {
          setCode(`# Write your bot here\n`);
        }
      });
  }, [submissionId]);

  const saveAndRun = async () => {
    const userId = localStorage.getItem('user_id');

    const res = await fetch('http://127.0.0.1:5000/api/submission/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_id: teamId, user_id: userId, code })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || 'Submitted successfully');
      redirect('/dashboard');
    } else {
      alert(data.error || 'Submission failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{submissionId ? 'Edit Submission' : 'New Submission'}</h1>
        <Editor
          height="60vh"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value || '')}
        />
        <button
          onClick={saveAndRun}
          className="bg-blue-600 text-white px-4 py-2 mt-4"
        >
          Save & Run Match
        </button>
      </div>
    </>
  );
}
