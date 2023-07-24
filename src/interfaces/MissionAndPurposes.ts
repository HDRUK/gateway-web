interface MissionAndPurposes {
    id: string;
    title: string;
    date: string;
    content: string;
}

interface MissionAndPurposesNode {
    node: MissionAndPurposes;
}

interface MissionAndPurposesResponse {
    posts: { edges: MissionAndPurposesNode[] };
}

export type {
    MissionAndPurposesNode,
    MissionAndPurposes,
    MissionAndPurposesResponse,
};
