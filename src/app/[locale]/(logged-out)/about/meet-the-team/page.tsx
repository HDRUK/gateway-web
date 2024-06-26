import { getMeetTheTeam } from "@/utils/cms";
import TeamMembers from "./components/TeamMembers";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Meet the team",
    description: "",
};

export default async function MeetTheTeam() {
    const data = await getMeetTheTeam();

    return <TeamMembers data={data[0]} />;
}
