import { getContributorsAndCollaborators, getMeetTheTeam } from "@/utils/cms";
import TeamMembers from "./components/TeamMembers";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - Meet the team",
    description: "",
};

export default async function MeetTheTeam() {
    const teamData = await getMeetTheTeam().then(data => data[0].node);
    const stakeholderData = await getContributorsAndCollaborators().then(
        data => data[0].node
    );

    return (
        <>
            <TeamMembers
                title={teamData.title}
                data={teamData.meetTheTeamRepeater}
            />
            ;
            <TeamMembers
                title={stakeholderData.title}
                data={stakeholderData.contributorsAndCollaborators}
            />
            ;
        </>
    );
}
