import metaData, { noFollowRobots } from "@/utils/metdata";
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
