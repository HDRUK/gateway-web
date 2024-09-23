import { Position } from "reactflow";
import theme from "@/config/theme";

export interface NodeValue {
    name: string;
    label?: string;
    href?: string;
    source?: string;
    hidden?: boolean;
}

export const nodeValueToRectNode = (
    node: NodeValue,
    index: number,
    nNodes: number,
    centerX: number,
    centerY: number
) => {
    const initialRad = 0.2;
    const angleRad = initialRad + (index * 2 * Math.PI) / nNodes;

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
    let correctionX = node.label ? 3.0 * node.label.length : 100;
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
            name: node.name,
            label: node.label,
            position,
            color,
            href: node.href,
            hidden: node.hidden,
            source: node.source,
        },
    };
};
