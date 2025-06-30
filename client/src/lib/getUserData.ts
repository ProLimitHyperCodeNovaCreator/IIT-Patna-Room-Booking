import {get} from "@/services/apiEndPoints";

interface User {
    role: "ADMIN" | "USER";
    email: string;
    name: string;
    initials: string | "UX";
}

interface AuthResponse {
    message?: string;
    user?: User;
}

export const getUserData = async (): Promise<User> => {
  try {
    const response = await get("/auth/token");
    const request = response.data as AuthResponse;
    const user = request.user as User;
    user.initials = user.name.split(" ").map((n: string) => n[0].toUpperCase()).join("");
    if (!user || !user.name) throw new Error("User not found");
    return user;

  } catch (error: any) {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw error;
  }
};
