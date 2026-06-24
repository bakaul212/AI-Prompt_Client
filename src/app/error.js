'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("System Matrix Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-black font-mono text-rose-500 tracking-wider">CRASH</h1>
      <h2 className="text-sm font-bold text-slate-300 mt-4 font-mono">// RUNTIME_EXECUTION_ABORTED</h2>
      <p className="text-slate-500 text-xs max-w-md mt-2 font-mono bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl">
        {error?.message || "An unexpected breach in the code architecture has been detected."}
      </p>
      <button onClick={() => reset()} className="mt-6 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold rounded-xl uppercase tracking-wider transition-all">
        Re-boot Environment
      </button>
    </div>
  );
}