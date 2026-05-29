import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-6">
        S
      </div>
      <h1 className="text-4xl font-bold text-stone-900 mb-2">Shiva Drink & Dine</h1>
      <p className="text-stone-500 mb-8">Fresh food • Great vibes</p>
      <Link
        href="/menu"
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg active:scale-95"
      >
        View Our Menu →
      </Link>
    </div>
  );
}
