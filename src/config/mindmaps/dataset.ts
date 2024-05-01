import { nodeValueToRectNode } from "./common";

const centerX = 0;
const centerY = 0;

const outerNodeValues = [
    {
        name: "tools",
        label: undefined,
        href: "/search?type=tools",
    },
    {
        name: "dur",
        label: undefined,
        href: "/search?type=dur",
    },
    {
        name: "linkages",
        label: undefined,
        /* to-do: section does not exist on the landing page yet */
    },
    {
        name: "collections",
        label: undefined,
        href: "/search?type=collections",
    },
    {
        name: "synthetic",
        label: undefined,
    },
];

const rootNode = {
    id: "node-root",
    type: "circle",
    position: { x: centerX, y: centerY },
    data: { id: 0, name: "root", label: undefined },
};

const outerNodes = outerNodeValues.map((node, index) =>
    nodeValueToRectNode(node, index, outerNodeValues.length, centerX, centerY)
);

const initialEdges = outerNodeValues.map((node, index) => ({
    id: `e1-${index}`,
    source: "node-root",
    target: `node-${node.name}`,
}));

const connectionLineStyle = { stroke: "black", strokeWidth: 3 };

export { rootNode, outerNodes, connectionLineStyle, initialEdges };
