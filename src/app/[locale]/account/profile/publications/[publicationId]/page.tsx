import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import CreatePublication from "../components/CreatePublication/CreatePublication";

export const metadata = metaData(
    {
        title: "Publication Edit - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function PublicationEditPage({
    params,
}: {
    params: Promise<{ publicationId: string; teamId: string }>;
}) {
    const user = await getUser();
    const { publicationId, teamId } = await params;

    return (
        <CreatePublication
            teamId={teamId}
            userId={user.id.toString()}
            publicationId={publicationId}
        />
    );
}
