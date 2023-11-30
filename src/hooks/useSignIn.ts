"use client";

import { SignIn } from "@/interfaces/SignIn";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

const useSignIn = () => {
    const { hideDialog } = useDialog();
    const router = useRouter();
    const { mutate } = useSWRConfig();

    const signIn = usePost<SignIn>(apis.signInInternalUrl, {
        localeKey: "auth",
        successNotificationsOn: false,
    });

    return async (data: SignIn) => {
        await signIn(data);
        hideDialog();
        setTimeout(() => {
            router.push("/account");
            mutate(apis.authInternalUrl);
        }, 500);
    };
};

export default useSignIn;
