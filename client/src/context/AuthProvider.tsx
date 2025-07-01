'use client'
import {createContext, useContext, useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import {get} from '@/services/apiEndPoints';
import { toast } from 'sonner';

interface Iresponse{
  user: Iuser;
  message: string;
}

interface Iuser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

const AuthContext = createContext({
    user: null as Iuser | null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Iuser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await get('/auth/token');
        if(response.status === 401){
            toast.error('Unauthorized access');
            router.push('/login');
        } else {
            const request = response.data as Iresponse;
            setUser(request.user as Iuser);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        toast.error('Failed to fetch user data');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = ()=> useContext(AuthContext);