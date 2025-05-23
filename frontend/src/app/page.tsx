import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to ProgBattle</h1>
        <p>Compete by coding bots, running matches, and climbing the leaderboard!</p>
      </main>
    </>
  );
}