import { nodeValueToRectNode } from "./common";

const centerX = 0;
const centerY = 0;

const outerNodeValues = [
    {
        name: "tools",
        label: "View associated data analysis scripts/software",
        href: "/search?type=tools",
    },
    {
        name: "dur",
        label: "Research projects/ Data Use",
        href: "/search?type=dur",
    },
    {
        name: "linkages",
        label: "See which datasets are linkable",
        /* to-do: section does not exist on the landing page yet */
    },
    {
        name: "collections",
        label: "Explore associated Collections",
        href: "/search?type=collections",
    },
    {
        name: "synthetic",
        label: "Access synthetic data",
    },
];

const rootNode = {
    id: "root",
    type: "circle",
    position: { x: centerX, y: centerY },
    data: { id: 0, label: "Data custodian link" },
};

const outerNodes = outerNodeValues.map((node, index) =>
    nodeValueToRectNode(node, index, outerNodeValues.length, centerX, centerY)
);

const initialEdges = outerNodeValues.map((node, index) => ({
    id: `e1-${index}`,
    source: "root",
    target: `node-${node.name}`,
}));

const connectionLineStyle = { stroke: "black", strokeWidth: 3 };

export { rootNode, outerNodes, connectionLineStyle, initialEdges };
