import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-700 p-4 text-white flex gap-4">
      <Link href="/" className="hover:text-green-400 transition">Home</Link>
      <Link href="/login" className="hover:text-green-400 transition">Login</Link>
      <Link href="/register" className="hover:text-green-400 transition">Register</Link>
      <Link href="/dashboard" className="hover:text-green-400 transition">Dashboard</Link>
      <Link href="/leaderboard" className="hover:text-green-400 transition">Leaderboard</Link>
      <Link href="/submissions" className="hover:text-green-400 transition">Submissions</Link>
      <Link href="/match-logs" className="hover:text-green-400 transition">Match Logs</Link>
    </nav>
  );
}
