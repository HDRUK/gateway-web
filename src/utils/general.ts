import { User } from "@/interfaces/User";
import jwtDecode from "jwt-decode";

interface AuthToken {
    user: User;
}

const getUserFromToken = (
    cookies: Partial<{ [key: string]: string }>
): undefined | User => {
    if (!cookies?.token) return undefined;
    const { user } = jwtDecode<AuthToken>(cookies.token);
    return user;
};

export { getUserFromToken };
