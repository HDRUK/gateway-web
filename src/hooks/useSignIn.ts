"use client";

import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { SignIn } from "@/interfaces/SignIn";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";

const useSignIn = () => {
    const { hideDialog } = useDialog();
    const router = useRouter();
    const { mutate } = useSWRConfig();

    const signIn = usePost<SignIn>(apis.signInInternalUrl, {
        localeKey: "auth",
        successNotificationsOn: false,
        errorNotificationsOn: false,
    });

    return async (data: SignIn) => {
        await signIn(data).then(response => {
            if (response) {
                hideDialog();
                router.push("/account");
                mutate(apis.authInternalUrl);
            } else {
                notificationService.apiError("Failed to sign in"),
                    {
                        persist: false,
                    };
            }
        });
    };
};

export default useSignIn;
