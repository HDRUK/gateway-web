import metaData, { noFollowRobots } from "@/utils/metdata";
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
