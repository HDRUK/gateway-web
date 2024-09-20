import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import CreatePublication from "../components/CreatePublication/CreatePublication";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Publication Edit",
    description: "",
};

export default async function PublicationEditPage({
    params,
}: {
    params: { publicationId: string; teamId: string };
}) {
    const { publicationId, teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["papers.update"]}>
            <CreatePublication teamId={teamId} publicationId={publicationId} />
        </ProtectedAccountRoute>
    );
}
