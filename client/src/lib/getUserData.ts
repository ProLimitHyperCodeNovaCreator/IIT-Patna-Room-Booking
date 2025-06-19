import {get} from "@/services/apiEndPoints";

interface User {
    role: "ADMIN" | "USER";
    email: string;
    name: string;
    initials?: string;
}

interface AuthResponse {
    message?: string;
    user?: User;
}

export const getUserData = async () => {
    try {
        const response = await get("/auth/token");
        const request = response.data as AuthResponse;
        const user = request.user as User;
        if (!user || !user.name) return null;
        const initials: string = user.name.split(" ").map((name) => name.charAt(0)).join("").toUpperCase();
        user.initials = initials;
        return user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};