import { Position } from "@xyflow/react";
import theme from "@/config/theme";
import { CtaLink } from "@/interfaces/Cms";

export interface NodeValue {
    name: string;
    label?: string;
    href?: string;
    source?: string;
    hidden?: boolean;
    ctaLink: CtaLink | null,
}

export const nodeValueToRectNode = (
    node: NodeValue,
    index: number,
    nNodes: number,
    centerX: number,
    centerY: number,
) => {
    const initialRad = 0.05 * Math.PI;
    const angleRad = initialRad + (index * 2 * Math.PI) / nNodes;

    let position; // connector position
    let origin; // origin of node for positioning
    const radius = 140; // distance away from the center
    let color = theme.palette.secondary.main;

    if (angleRad <= 2 * Math.PI && angleRad > 1 * Math.PI) {
        origin = [1, 0.5];
        position = Position.Right;
        color = theme.palette.primary.main;
    } else {
        origin = [0, 0.5];
        position = Position.Left;
    }

    // calculate the position of the box
    const spacingFactor = 0.4; // If extra nodes are added in future, increase this spacingFactor to stop nodes overlapping vertically
    const x = centerX + radius * Math.sin(angleRad);
    const y =
        centerY +
        (Math.abs(index - (nNodes - 1) / 2) - nNodes / 4) *
            radius *
            spacingFactor;

    return {
        id: `node-${node.name}`,
        type: node.name === "cohortDiscovery" ? "cohort" : "rect",
        position: { x, y },
        origin: origin,
        data: {
            id: index,
            name: node.name,
            label: node.label,
            position,
            color,
            href: node.href,
            hidden: node.hidden,
            source: node.source,
            ctaLink: node.name === "cohortDiscovery" ? node.ctaLink : null,
        },
    };
};
