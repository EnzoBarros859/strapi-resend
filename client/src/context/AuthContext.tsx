import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import axios from 'axios';
import { useRouter } from 'next/router';

interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { token } = parseCookies();
    if (token) {
      // You can add a function here to validate the token and get user data
      // For now, we'll just set a basic user object
      setUser({ id: 1, username: 'User', email: 'user@example.com', confirmed: true });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: email,
        password,
      });

      const { jwt, user } = response.data;
      
      // Check if user exists and is confirmed
      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (!user.confirmed) {
        // Clear any existing token
        destroyCookie(null, 'token');
        setUser(null);
        throw new Error('Please confirm your email before logging in. Check your inbox for the confirmation link.');
      }

      // Only set token and redirect if email is confirmed
      setCookie(null, 'token', jwt, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      setUser(user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      // Clear any existing token on error
      destroyCookie(null, 'token');
      setUser(null);
      throw new Error(error.response?.data?.error?.message || error.message || 'Login failed. Please try again.');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:1337/api/auth/local/register', {
        username,
        email,
        password,
      });

      const { jwt, user } = response.data;
      setCookie(null, 'token', jwt, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      console.log("user", user);
      setUser(user);
      
      // Redirect to login with a message that confirmation email has been sent
      router.push('/login?message=confirmation_sent');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };



  const logout = () => {
    destroyCookie(null, 'token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
              }}
    >
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