import CreatePublication from "../components/CreatePublication";
import metaData, {noFollowRobots} from "@/utils/metdata";

export const metadata = metaData({
    title: "Publication Create - My Account",
    description: ""
}, noFollowRobots);
export default async function PublicationCreatePage() {
    return <CreatePublication />;
}
