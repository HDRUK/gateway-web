import LeftNav from "@/modules/LeftNav";
import ActionBar from "@/components/ActionBar";
import { getPermissions, getUser } from "@/utils/api";
import { cookies } from "next/headers";
import TwoColumn from "@/components/TwoColumn";

export default async function AccountLayout({
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
