import { User } from "@/interfaces/User";
import jwtDecode from "jwt-decode";

interface AuthToken {
    user: User;
}

const getUserFromToken = (token: string | undefined): null | User => {
    if (!token) return null;
    const response = jwtDecode<AuthToken>(token);
    return response?.user;
};

export { getUserFromToken };
