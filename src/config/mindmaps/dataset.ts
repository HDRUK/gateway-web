import { nodeValueToRectNode } from "./common";

const centerX = 0;
const centerY = 0;

const outerNodeValues = [
    {
        name: "tools",
        href: "/search?type=tools",
    },
    {
        name: "durs",
        href: "/search?type=dur",
    },
    {
        name: "curatedPublications",
        source: "GAT",
        href: "/search?type=publications",
    },
    {
        name: "externalPublications",
        source: "FED",
        href: "/search?type=publications",
    },
    {
        name: "collections",
        href: "/search?type=collections",
    },
    {
        name: "synthetic",
    },
    {
        name: "structuralMetadata",
        href: "scrollTo:Structural Metadata",
    },
    {
        name: "demographics",
        href: "scrollTo:Demographics",
    },
    {
        name: "dataCustodian",
    },
];

const rootNode = {
    id: "node-root",
    type: "circle",
    position: { x: centerX, y: centerY },
    data: {
        id: 0,
        name: "root",
        label: undefined,
    },
};

const getOuterNodes = nodes =>
    nodes.map((node, index) =>
        nodeValueToRectNode(node, index, nodes.length, centerX, centerY)
    );

const initialEdges = outerNodeValues.map((node, index) => ({
    id: `e1-${index}`,
    source: "node-root",
    target: `node-${node.name}`,
}));

const connectionLineStyle = { stroke: "rgb(226, 226, 226)", strokeWidth: 3 };

export {
    rootNode,
    outerNodeValues,
    getOuterNodes,
    connectionLineStyle,
    initialEdges,
};
