// client/src/app/dashboard/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardMainPage() {
    const router = useRouter();

    useEffect(() => {
        // ড্যাশবোর্ডে ঢুকলেই সরাসরি 'My Prompts' পেজে নিয়ে যাবে
        router.push('/dashboard/my-prompts');
    }, [router]);

    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-2">
                <div className="h-3 w-3 bg-cyan-600 rounded-full"></div>
                <div className="h-3 w-3 bg-cyan-600 rounded-full"></div>
                <div className="h-3 w-3 bg-cyan-600 rounded-full"></div>
            </div>
            <p className="text-gray-500 font-medium ml-3 text-sm">Loading Workspace Dashboard...</p>
        </div>
    );
}