import { cookies } from "next/headers";
import ActionBar from "@/components/ActionBar";
import TwoColumn from "@/components/TwoColumn";
import LeftNav from "@/modules/LeftNav";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";

export default async function AccountProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = await getPermissions(user.roles);

    return (
        <div>
            <TwoColumn
                leftContent={<LeftNav permissions={permissions} />}
                rightContent={children}
            />
            <ActionBar />
        </div>
    );
}
