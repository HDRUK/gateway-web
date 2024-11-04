interface Stakeholder {
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

interface ContributorsAndCollaborators {
    title: string;
    id: string;
    contributorsCollaborators: {
        summaryText: string;
        teamList: Stakeholder[];
    };
}

interface ContributorsAndCollaboratorsNode {
    node: ContributorsAndCollaborators;
}

export type {
    ContributorsAndCollaborators,
    ContributorsAndCollaboratorsNode,
    Stakeholder,
};
