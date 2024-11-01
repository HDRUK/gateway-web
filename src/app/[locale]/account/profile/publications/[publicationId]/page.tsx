import CreatePublication from "../components/CreatePublication/CreatePublication";
import metaData, {noFollowRobots} from "@/utils/metdata";

export const metadata = metaData({
    title: "Publication Edit - My Account",
    description: ""
}, noFollowRobots);
export default async function PublicationEditPage({
    params,
}: {
    params: { publicationId: string; teamId: string };
}) {
    const { publicationId, teamId } = params;
    return <CreatePublication teamId={teamId} publicationId={publicationId} />;
}
