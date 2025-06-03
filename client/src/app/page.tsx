"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/services/apiEndPoints";

export default function HomeRedirector() {
  const router = useRouter();
  type AuthResponse = {
    message?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
    };
  };

  useEffect(() => {
    get("/api/auth/token")
      .then((res) => {
        const response = res?.data as AuthResponse;
        const user = response.user;
        if (!user) {
          router.push("/login");
        } else if (user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/user");
        }
      })
      .catch(() => {
        router.push("/login");
      });
  },[]);

  return null; // nothing is rendered
}
