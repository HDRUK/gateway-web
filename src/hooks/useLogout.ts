import { useRouter } from "next/router";
import { getRequest } from "@/services/api/get";
import vars from "@/config/vars";

const useLogout = () => {
    const router = useRouter();

    return async () => {
        await getRequest(vars.logoutInternalUrl, {
            notificationOptions: {
                notificationsOn: false,
            },
        });
        router.push("/");
    };
};

export default useLogout;
