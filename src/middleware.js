import { NextResponse } from 'next/server';

export function middleware(request) {
  // ১. আপনার Auth Cookie বা Token-এর নাম অনুযায়ী 'token' পরিবর্তন করতে পারেন
  const token = request.cookies.get('token')?.value; 
  const { pathname } = request.nextUrl;

  // ২. লগইন ছাড়া কেউ /dashboard বা /admin এ ঢুকতে চাইলে তাকে /login পেজে রিডাইরেক্ট করে দেবে
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// এই মিডলওয়্যারটি কোন কোন রুটের ক্ষেত্রে কাজ করবে তা এখানে বলে দেওয়া
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'], 
};