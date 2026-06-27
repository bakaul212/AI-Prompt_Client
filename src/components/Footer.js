'use client';

import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedinIn, FaGlobe } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#030508] text-slate-400 py-12 border-t border-slate-900/80 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
        
        {/* কলাম ১: ব্র্যান্ড ইনফো */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider">
            <span className="text-indigo-500 font-black">⚡</span> PromptForge
          </div>
          <p className="text-slate-500 leading-relaxed max-w-[240px]">
            Discover, copy, and create production-ready AI prompts for Gemini, ChatGPT, Claude, and Midjourney. Build better apps, write better code, and automate your productivity.
          </p>
        </div>

        {/* কলাম ২: প্ল্যাটফর্ম লিঙ্কস */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[10px] text-slate-300">Platform</h4>
          <ul className="space-y-2 text-slate-500">
            <li><Link href="/prompts" className="hover:text-indigo-400 transition-colors">All Prompts</Link></li>
            <li><Link href="/trending" className="hover:text-indigo-400 transition-colors">Trending Prompts</Link></li>
            <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
            <li><Link href="/register" className="hover:text-indigo-400 transition-colors">Register</Link></li>
            <li><Link href="/demo-user" className="hover:text-indigo-400 transition-colors text-indigo-400/80 font-medium">Demo User</Link></li>
          </ul>
        </div>

        {/* কলাম ৩: রিসোর্স লিঙ্কস */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[10px] text-slate-300">Resources</h4>
          <ul className="space-y-2 text-slate-500">
            <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">UI Elements</span></li>
            <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Dev Meets Dev</span></li>
            <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Stripe Payment</span></li>
            <li><span className="hover:text-indigo-400 cursor-pointer transition-colors">Firebase Auth</span></li>
          </ul>
        </div>

        {/* কলাম ৪: সোশ্যাল ও কানেক্ট */}
        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-[10px] text-slate-300">Connect</h4>
          <div className="flex gap-2">
            <a href="#" className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/60 hover:border-indigo-500/50 hover:text-white transition-all text-slate-400">
              <FaTwitter size={14} />
            </a>
            <a href="#" className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/60 hover:border-indigo-500/50 hover:text-white transition-all text-slate-400">
              <FaGithub size={14} />
            </a>
            <a href="#" className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/60 hover:border-indigo-500/50 hover:text-white transition-all text-slate-400">
              <FaLinkedinIn size={14} />
            </a>
            <a href="#" className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/60 hover:border-indigo-500/50 hover:text-white transition-all text-slate-400">
              <FaGlobe size={14} />
            </a>
          </div>
          <div className="text-[11px] text-slate-500">
            Questions? Support at:<br />
            <span className="text-indigo-400/80 hover:underline cursor-pointer">support@promptforge.com</span>
          </div>
        </div>

      </div>

      {/* নিচের মেটা এরিয়া */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-900/60 text-center text-[10px] text-slate-600 font-mono">
        © 2026 PromptForge. All rights reserved. Created with ❤️ for AI engineering.
      </div>
    </footer>
  );
};

export default Footer;