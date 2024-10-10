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
    return <CreatePublication teamId={teamId} publicationId={publicationId} />;
}
