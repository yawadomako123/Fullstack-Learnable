import React, { createContext, ReactNode, useContext, useState } from 'react';

type User = {
  name: string;
  email: string;
  profileImage?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfileImage: (uri: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const login = (email: string, name: string) => {
    setUser({ email, name, profileImage: 'https://i.pravatar.cc/150?img=47' });
  };

  const logout = () => setUser(null);

  const updateProfileImage = (uri: string) => {
    setUser((prev) => prev ? { ...prev, profileImage: uri } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
