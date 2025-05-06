import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { User } from "@/interfaces/User";

interface AuthToken {
    user: User;
    exp: string;
}

const isJWTExpired = (exp: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
};

const getUserFromToken = (token: string | undefined): null | User => {
    if (!token) return null;

    const response = jwtDecode<AuthToken>(token);
    if (isJWTExpired(+response.exp)) {
        return null;
    }

    return response?.user;
};

const setTemporaryCookie = (name: string, value: string, seconds: number) => {
    const expiresInDays = seconds / (24 * 60 * 60); // convert seconds to days
    Cookies.set(name, value, { expires: expiresInDays });
};

export { getUserFromToken, setTemporaryCookie };
