import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
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
    const cookieStore = cookies();
    const user = await getUser(cookieStore);

    return <CreatePublication userId={user.id.toString()} />;
}
