"use client";

import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import getRequest from "@/services/api/get";
import apis from "@/config/apis";

const useLogout = () => {
    const router = useRouter();
    const { mutate } = useSWRConfig();

    return async () => {
        await getRequest(apis.logoutInternalUrl, {
            notificationOptions: { errorNotificationsOn: false },
        });
        mutate(apis.authInternalUrl, { data: undefined });
        router.push("/");
    };
};

export default useLogout;
