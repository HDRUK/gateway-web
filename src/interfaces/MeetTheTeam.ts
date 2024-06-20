interface TeamMember {
    info: string;
    name: string;
    jobTitle: string;
    image: {
        node: {
            sourceUrl: string;
            altText: string;
        };
    };
}

interface MeetTheTeam {
    title: string;
    id: string;
    meetTheTeamRepeater: {
        summaryText: string;
        teamList: TeamMember[];
    };
}

interface MeetTheTeamNode {
    node: MeetTheTeam;
}

export type { MeetTheTeam, MeetTheTeamNode, TeamMember };
