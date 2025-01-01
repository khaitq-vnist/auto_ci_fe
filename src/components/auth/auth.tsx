'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth_context';


const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // if (!isAuthenticated) {
        //     router.push('/login');
        // }
    }, [isAuthenticated, router]);

    return (
        <div
            style={{
                backgroundColor: '#ffffff', // Ensure the background is explicitly set
                minHeight: '100vh',
            }}
        >
            {children}
        </div>
    );
};

export default AuthGuard;
