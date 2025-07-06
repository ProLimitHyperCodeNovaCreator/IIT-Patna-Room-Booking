'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { get } from '@/services/apiEndPoints';
import { toast } from "sonner";

interface User {
  role: 'ADMIN' | 'USER';
  email?: string;
  name?: string;
  // add more user properties if needed
}

interface AuthResponse {
  user: User;
  // add more response properties if needed
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await get('/auth/token');
        if (response.status === 200) {
          const request = response.data as AuthResponse;

          if (request?.user?.role === 'ADMIN') {
            router.push('/dashboard/admin');
          } else if (request?.user?.role === 'USER') {
            router.push('/dashboard/user');
          }
        } else if (response.status === 401) {
          router.push('/login');
        }
      } catch(err){
        if(process.env.NODE_ENV === 'development') {
          console.error('Error fetching token:', err);
        }
        //console.error('Error fetching token:', error);
        toast.error('Some error please try again');
        router.push('/login'); // fallback in case of fetch failure
      }
    }

    fetchData();
  }, [router]); // safer to include router in the deps array

  return null;
}
