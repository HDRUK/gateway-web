"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import getRequest from "@/services/api/get";
import apis from "@/config/apis";

const useLogout = () => {
    const t = useTranslations();
    const router = useRouter();
    const { mutate } = useSWRConfig();

    return async () => {
        await getRequest(apis.logoutInternalUrl, {
            notificationOptions: { errorNotificationsOn: false, t },
        });
        mutate(apis.authInternalUrl, { data: undefined });
        router.push("/");
    };
};

export default useLogout;
