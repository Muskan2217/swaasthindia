'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiClient.get('/me');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('auth_token');
        setUser(null);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const logout = async () => {
    try {
     await apiClient.post('/logout');
    } catch (err) {
      // Proceed with local cleanup even if API logout fails
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/login');
    }
  };

  return { user, loading, logout };
}