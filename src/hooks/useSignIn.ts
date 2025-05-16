"use client";

import { useRouter } from "next/navigation";
import { SignIn } from "@/interfaces/SignIn";
import useDialog from "@/hooks/useDialog";
import apis from "@/config/apis";

const useSignIn = () => {
    const { hideDialog } = useDialog();
    const router = useRouter();

    return async (data: SignIn) => {
        try {
            const response = await fetch(apis.signInInternalUrl, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
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
