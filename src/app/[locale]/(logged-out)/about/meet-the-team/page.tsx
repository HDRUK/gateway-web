import { getContributorsAndCollaborators, getMeetTheTeam } from "@/utils/cms";
import metaData from "@/utils/metdata";
import TeamMembers from "./components/TeamMembers";

export const metadata = metaData({
    title: "Meet the team - About",
    description: "",
});
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
