import Profile from "./profile";
import metaData, {noFollowRobots} from "@/utils/metdata";

export const metadata = metaData({
    title: "Profile",
    description: ""
}, noFollowRobots);
export default function ProfilePage() {
    return <Profile />;
}
