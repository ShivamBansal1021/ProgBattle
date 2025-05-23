'use client'
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function Leaderboard() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/leaderboard')
      .then(res => res.json())
      .then(setTeams);
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border text-black">Team</th>
              <th className="p-2 border text-black">Score</th>
              <th className="p-2 border text-black">Members</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team: any, idx: number) => (
              <tr key={idx}>
                <td className="p-2 border">{team.team}</td>
                <td className="p-2 border">{team.score}</td>
                <td className="p-2 border">{team.members.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
