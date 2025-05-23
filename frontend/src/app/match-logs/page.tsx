'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function MatchLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    fetch(`http://127.0.0.1:5000/api/match/logs?user_id=${userId}`)
      .then(res => res.json())
      .then(setLogs);
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Match Logs</h2>
        {logs.length === 0 ? (
          <p>No logs available.</p>
        ) : logs.map((log, idx) => (
          <div key={idx} className="bg-gray-100 p-4 mb-4">
            <p className="text-sm text-gray-500">Opponent: {log.opponent}</p>
            <p className="text-sm text-gray-500">Time: {new Date(log.timestamp).toLocaleString()}</p>
            <pre className="bg-white p-2 mt-2 text-black overflow-x-auto text-sm">{log.log}</pre>
          </div>
        ))}
      </div>
    </>
  );
}
