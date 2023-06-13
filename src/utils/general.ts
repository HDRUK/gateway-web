import { User } from "@/interfaces/User";
import jwtDecode from "jwt-decode";

interface AuthToken {
    user: User;
}

const getUserFromToken = (
    cookies: Partial<{ [key: string]: string }>
): null | User => {
    if (!cookies?.token) return null;
    const { user } = jwtDecode<AuthToken>(cookies.token);
    return user;
};

export { getUserFromToken };
