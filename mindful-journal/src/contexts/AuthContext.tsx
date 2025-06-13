import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

type User = {
  id: string;
  email: string;
  createdAt: string;
  lastLogin: string;
};

type StoredUser = User & {
  passwordHash: string;
};

type UsersCollection = {
  [email: string]: StoredUser;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'users_collection';
const CURRENT_USER_KEY = 'current_user';

const generateUserId = (email: string): string => {
  return CryptoJS.SHA256(email + Date.now().toString()).toString().slice(0, 16);
};

const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const currentUserEmail = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (currentUserEmail) {
        const usersCollection = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        if (usersCollection) {
          const users: UsersCollection = JSON.parse(usersCollection);
          const currentUser = users[currentUserEmail];
          if (currentUser) {
            const { passwordHash, ...userData } = currentUser;
            setUser(userData);
          }
        }
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const usersCollection = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (!usersCollection) {
        throw new Error('No users found');
      }

      const users: UsersCollection = JSON.parse(usersCollection);
      const storedUser = users[email];

      if (!storedUser) {
        throw new Error('User not found');
      }

      const passwordHash = hashPassword(password);
      if (storedUser.passwordHash !== passwordHash) {
        throw new Error('Invalid credentials');
      }

      const updatedUser: StoredUser = {
        ...storedUser,
        lastLogin: new Date().toISOString(),
      };

      // Update the user in the collection
      users[email] = updatedUser;
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Set current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, email);
      
      const { passwordHash: _, ...userData } = updatedUser;
      setUser(userData);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const usersCollection = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: UsersCollection = usersCollection ? JSON.parse(usersCollection) : {};

      if (users[email]) {
        throw new Error('User already exists');
      }

      const newUser: StoredUser = {
        id: generateUserId(email),
        email,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Add new user to collection
      users[email] = newUser;
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Set current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, email);
      
      const { passwordHash, ...userData } = newUser;
      setUser(userData);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 