"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { SignIn } from "@/interfaces/SignIn";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";
import { sessionCookie, sessionHeader, sessionPrefix } from "@/config/session";

const useSignIn = () => {
    const { hideDialog } = useDialog();
    const router = useRouter();

    return async (data: SignIn) => {
        const session = Cookies.get(sessionCookie);

        try {
            const response = await fetch(apis.signInInternalUrl, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    [sessionHeader]: sessionPrefix + session,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Sign-in failed");
            }

            hideDialog();

            router.push("/account/profile");
        } catch (error) {
            console.error("Sign-in failed:", error);
            throw error;
        }
    };
};

export default useSignIn;
