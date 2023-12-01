interface MissionAndPurposes {
    id: string;
    title: string;
    date: string;
    content: string;
}

interface MissionAndPurposesNode {
    node: MissionAndPurposes;
}

export type { MissionAndPurposesNode, MissionAndPurposes };
