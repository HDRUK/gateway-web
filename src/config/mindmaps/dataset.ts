import { Position } from "reactflow";
import theme from "@/config/theme";

const centerX = 0;
const centerY = 0;

const outerNodeValues = [
    {
        label: "View publications that have used this dataset",
        x: 0,
        y: 150,
        color: theme.palette.secondary.main,
        position: Position.Bottom,
    },
    {
        label: "Research projects/ Data Use",
        x: 200,
        y: 80,
        color: theme.palette.secondary.main,
        position: Position.Left,
    },
    {
        label: "See which datasets are linkable",
        x: 250,
        y: 0,
        color: theme.palette.primary.main,
        position: Position.Left,
    },
    {
        label: "Explore associated Collections",
        x: 240,
        y: -60,
        color: theme.palette.secondary.main,
        position: Position.Left,
    },
    {
        label: "View associated data analysis scripts/software",
        x: 190,
        y: -130,
        color: theme.palette.secondary.main,
        position: Position.Left,
    },
    {
        label: "Read about coverage and completeness",
        x: -200,
        y: -150,
        color: theme.palette.primary.main,
        position: Position.Right,
    },
    {
        label: "Review data variables",
        x: -170,
        y: -80,
        color: theme.palette.primary.main,
        position: Position.Right,
    },
    {
        label: "Access synthetic data",
        x: -200,
        y: 0,
        color: theme.palette.primary.main,
        position: Position.Right,
    },
    {
        label: "Explore demographics",
        x: -150,
        y: 80,
        color: theme.palette.primary.main,
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
    return {
        id: `node-${index}`,
        type: "rect",
        position: { x: node.x, y: -1 * node.y },
        data: {
            id: index,
            label: node.label,
            position: node.position,
            color: node.color,
        },
    };
});

const initialEdges = outerNodeValues.map((_, index) => ({
    id: `e1-${index}`,
    source: "root",
    target: `node-${index}`,
}));

const connectionLineStyle = { stroke: "black", strokeWidth: 3 };

export { rootNode, outerNodes, connectionLineStyle, initialEdges };
