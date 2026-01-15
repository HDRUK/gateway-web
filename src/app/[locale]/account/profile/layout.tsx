import { cookies } from "next/headers";
import ActionBar from "@/components/ActionBar";
import TwoColumn from "@/components/TwoColumn";
import LeftNav from "@/modules/LeftNav";
import config from "@/config/config";
import { getUser } from "@/utils/api";
import { checkLeftNavCookie } from "@/utils/cookies";
import { getPermissions } from "@/utils/permissions";

export default async function AccountProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();
    const permissions = await getPermissions(user.roles);
    const cookieStore = await cookies();

    return (
        <>
            <TwoColumn
                leftContent={
                    <LeftNav
                        permissions={permissions}
                        navHeading={user.name}
                        initialLeftNavOpen={checkLeftNavCookie(
                            cookieStore.get(config.LEFT_NAV_COOKIE)?.value
                        )}
                    />
                }
                rightContent={children}
            />
            <ActionBar />
        </>
    );
}
