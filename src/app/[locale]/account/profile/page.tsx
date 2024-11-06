import metaData, { noFollowRobots } from "@/utils/metadata";
import Profile from "./profile";

export const metadata = metaData(
    {
        title: "Profile",
        description: "",
    },
    noFollowRobots
);
export default function ProfilePage() {
    return <Profile />;
}
