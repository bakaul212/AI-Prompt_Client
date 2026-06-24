import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-black font-mono text-indigo-500 tracking-widest animate-pulse">404</h1>
      <div className="bg-indigo-600 text-white px-2 text-xs font-mono rounded rotate-12 absolute transform -translate-y-12">
        Matrix Node Missing
      </div>
      <h2 className="text-xl font-bold text-white mt-4 font-mono">// ERROR: ROUTE_NOT_FOUND</h2>
      <p className="text-slate-400 text-xs max-w-sm mt-2 font-mono">
        The architectural coordinates you are looking for do not exist in the PromptForge mainframe.
      </p>
      <Link href="/" className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl uppercase tracking-wider transition-all">
        Return to Core Base
      </Link>
    </div>
  );
}