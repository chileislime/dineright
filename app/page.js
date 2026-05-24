export default function Home() {
  return (
    <main className="min-h-screen bg-green-950 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        <div className="mb-6">
          <span className="text-5xl font-bold text-white">Dine</span>
          <span className="text-5xl font-bold text-green-400">Right</span>
        </div>

        <p className="text-green-300 text-lg mb-2">
          Eat with purpose at Phelps Dining Hall.
        </p>
        <p className="text-green-500 text-sm mb-10">
          Tell us your goal. We'll tell you what to eat today.
        </p>

        <div className="flex flex-col gap-4">
          <button className="bg-green-500 hover:bg-green-400 text-white font-semibold py-4 rounded-2xl text-lg transition">
            💪 Lean Bulk
          </button>
          <button className="bg-green-700 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl text-lg transition">
            🔥 Cut (Lose Fat)
          </button>
          <button className="bg-green-800 hover:bg-green-700 text-white font-semibold py-4 rounded-2xl text-lg transition">
            ⚖️ Maintain
          </button>
        </div>

        <p className="text-green-600 text-xs mt-8">
          Hope College · Phelps Dining Hall
        </p>
      </div>
    </main>
  );
}