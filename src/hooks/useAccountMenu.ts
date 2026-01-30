import { useMemo } from "react";
import { useTranslations } from "next-intl";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH_COMMON = "common";

const useAccountMenu = ( ) => {
    const t = useTranslations(TRANSLATION_PATH_COMMON);
    const { user } = useAuth();

    const logout = useLogout();

    return useMemo(() => {
        const teams = (user?.teams || [])
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(team => ({
                label: team.name,
                key: team.name.toString().concat("-", team.id.toString()),
                href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${team.id}/${RouteName.TEAM_MANAGEMENT}`,
            }));

        return {
            myProfile: {
                label: t("myProfile"),
                href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}`,
            },
            otherItems: [
                ...teams,
                {
                    label: t("logout"),
                    action: logout,
                },
            ],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logout, user]);
};

export default useAccountMenu;
