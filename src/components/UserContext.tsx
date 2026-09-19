'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, SwapRequest } from '@/lib/types';

interface UserContextType {
  currentUser: User | null;
  allUsers: User[];
  pendingRequestsCount: number;
  loading: boolean;
  isAuthenticated: boolean;
  refreshCurrentUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  allUsers: [],
  pendingRequestsCount: 0,
  loading: true,
  isAuthenticated: false,
  refreshCurrentUser: async () => {}
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setAllUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load users from database', err);
    }
  };

  const fetchCurrentUserData = async (userId: string) => {
    try {
      const [userRes, swapsRes] = await Promise.all([
        fetch(`/api/users/${userId}`),
        fetch(`/api/swaps?userId=${userId}`)
      ]);

      const userData = await userRes.json();
      const swapsData = await swapsRes.json();

      if (userData.success && userData.user) {
        setCurrentUser(userData.user);
      }

      if (swapsData.success && swapsData.swaps) {
        const incomingPending = swapsData.swaps.filter(
          (s: SwapRequest) => s.receiverId === userId && s.status === 'PENDING'
        );
        setPendingRequestsCount(incomingPending.length);
      }
    } catch (err) {
      console.error('Failed to load authenticated user profile', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCurrentUser = async () => {
    const sessionUserId = (session?.user as any)?.id;
    if (sessionUserId) {
      await fetchCurrentUserData(sessionUserId);
      await fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      const userId = (session.user as any).id;
      if (userId) {
        fetchCurrentUserData(userId);
      } else {
        setLoading(false);
      }
    } else {
      setCurrentUser(null);
      setPendingRequestsCount(0);
      setLoading(false);
    }
  }, [status, session]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers,
        pendingRequestsCount,
        loading,
        isAuthenticated: status === 'authenticated',
        refreshCurrentUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
