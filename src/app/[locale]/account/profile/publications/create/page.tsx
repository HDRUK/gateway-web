import metaData, { noFollowRobots } from "@/utils/metadata";
import CreatePublication from "../components/CreatePublication";

export const metadata = metaData(
    {
        title: "Publication Create - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function PublicationCreatePage() {
    return <CreatePublication />;
}
