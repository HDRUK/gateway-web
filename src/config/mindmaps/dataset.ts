import { Position } from "reactflow";
import theme from "@/config/theme";

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
        href: "/",
    },
    {
        name: "collections",
        label: "Explore associated Collections",
        href: "/search?type=collections",
    },
    {
        name: "synthetic",
        label: "Access synthetic data",
        position: Position.Right,
    },
];

const rootNode = {
    id: "root",
    type: "circle",
    position: { x: centerX, y: centerY },
    data: { id: 0, label: "Data custodian link" },
};

const outerNodes = outerNodeValues.map((node, index) => {
    const initialRad = 0.2;
    const angleRad =
        initialRad + (index * 2 * Math.PI) / outerNodeValues.length;

    let position; // connector position
    const radius = 150; // distance away from the center
    switch (true) {
        case angleRad > 1.25 * Math.PI:
            position = Position.Right;

            break;
        case angleRad > 0.75 * Math.PI:
            position = Position.Bottom;

            break;
        case angleRad > 0.25 * Math.PI:
            position = Position.Left;

            break;
        default:
            position = Position.Top;
    }

    // correct for the length of the text box
    // rough guess that the length is 2.5 as long as the number of characters in the label
    let correctionX = 2.5 * node.label.length;
    let color = theme.palette.secondary.main;
    if (angleRad > Math.PI) {
        // need to subtract this if it's on the left side of the inner node
        correctionX *= -1;
        // also switch the color
        color = theme.palette.primary.main;
    }

    // calculate the x position of the box
    // - make a correction to the x position due to the box shape
    const x = centerX + radius * Math.sin(angleRad) + correctionX;
    // calculate the y position of the box
    // - dont bother making a small correction for the y position due to box shape
    const y = centerY + radius * Math.cos(angleRad);

    return {
        id: `node-${node.name}`,
        type: "rect",
        position: { x, y },
        data: {
            id: index,
            label: node.label,
            position,
            color,
            href: node.href,
        },
    };
});

const initialEdges = outerNodeValues.map((node, index) => ({
    id: `e1-${index}`,
    source: "root",
    target: `node-${node.name}`,
}));

const connectionLineStyle = { stroke: "black", strokeWidth: 3 };

export { rootNode, outerNodes, connectionLineStyle, initialEdges };
