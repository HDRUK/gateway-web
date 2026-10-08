import { Node, Position } from "@xyflow/react";
import theme from "@/config/theme";

export const ROOT_SIZE = 100;

export const STACKED_ROOT_SIZE = 80;

export const STACK_BELOW_WIDTH = 500;

const MIN_FONT_SIZE = 14;

const MAX_FONT_SIZE = 20;

export const MIN_ZOOM = MIN_FONT_SIZE / theme.typography.fontSize;

export const MAX_ZOOM = MAX_FONT_SIZE / theme.typography.fontSize;

const FIT_PADDING = 0.1;

const RADIAL_GAP = parseFloat(theme.spacing(0.5));

const STACK_GAP = parseFloat(theme.spacing(1.5));

const GROUP_GAP = parseFloat(theme.spacing(4));

export interface Size {
    width: number;
    height: number;
}

interface MindMapLayout {
    nodes: Node[];
    contentHeight?: number;
    isWrapping: boolean;
}

interface LayoutInput {
    rootNode: Node;
    outerNodes: Node[];
    rootSize: Size;
    outerSizes: Size[];
    width: number;
}

const isRightOf = (rootNode: Node, node: Node) =>
    node.position.x >= rootNode.position.x;

const offsetFrom = (rootNode: Node, node: Node) =>
    Math.abs(node.position.x - rootNode.position.x);

export const orderOuterNodes = (rootNode: Node, outerNodes: Node[]) =>
    outerNodes
        .filter(node => !node.hidden)
        .sort(
            (a, b) =>
                Number(!isRightOf(rootNode, a)) -
                    Number(!isRightOf(rootNode, b)) ||
                a.position.y - b.position.y
        );

export const isStackedWidth = (width: number) =>
    width > 0 && width < STACK_BELOW_WIDTH;

const withMeasured = (node: Node, size: Size) =>
    size.width && size.height ? { ...node, measured: size } : node;

const packColumn = (
    outerNodes: Node[],
    outerSizes: Size[],
    indexes: number[],
    ys: number[]
) => {
    if (!indexes.length) {
        return;
    }

    let previousBottom = -Infinity;

    const placed = indexes.map(index => {
        const halfHeight = outerSizes[index].height / 2;
        const y = Math.max(
            outerNodes[index].position.y,
            previousBottom + RADIAL_GAP + halfHeight
        );

        previousBottom = y + halfHeight;

        return y;
    });

    const first = indexes[0];
    const last = indexes[indexes.length - 1];
    const centre = (firstY: number, lastY: number) =>
        (firstY -
            outerSizes[first].height / 2 +
            lastY +
            outerSizes[last].height / 2) /
        2;
    const shift =
        centre(outerNodes[first].position.y, outerNodes[last].position.y) -
        centre(placed[0], placed[placed.length - 1]);

    indexes.forEach((index, position) => {
        ys[index] = placed[position] + shift;
    });
};

export const getRadialLayout = ({
    rootNode,
    outerNodes,
    rootSize,
    outerSizes,
    width,
    preferredHeight,
}: LayoutInput & { preferredHeight?: number }): MindMapLayout => {
    const rootRadius = rootSize.width / 2;
    const available = width / (1 + FIT_PADDING);
    const half = available / 2;

    const extent = (right: boolean) =>
        outerNodes.reduce(
            (widest, node, index) =>
                isRightOf(rootNode, node) === right
                    ? Math.max(
                          widest,
                          offsetFrom(rootNode, node) + outerSizes[index].width
                      )
                    : widest,
            rootRadius
        );

    const allowance = {
        right: available - Math.min(extent(false), half),
        left: available - Math.min(extent(true), half),
    };

    const maxWidths = outerNodes.map(
        node =>
            allowance[isRightOf(rootNode, node) ? "right" : "left"] -
            offsetFrom(rootNode, node)
    );

    const isWrapping = outerNodes.some(
        (node, index) => outerSizes[index].width >= maxWidths[index] - 1
    );

    const ys: number[] = [];
    const indexesOn = (right: boolean) =>
        outerNodes
            .map((node, index) => index)
            .filter(index => isRightOf(rootNode, outerNodes[index]) === right);

    packColumn(outerNodes, outerSizes, indexesOn(true), ys);
    packColumn(outerNodes, outerSizes, indexesOn(false), ys);

    const nodes = [
        withMeasured(rootNode, rootSize),
        ...outerNodes.map((node, index) =>
            withMeasured(
                {
                    ...node,
                    position: { x: node.position.x, y: ys[index] },
                    data: {
                        ...node.data,
                        nodeSx: {
                            ...(node.data.nodeSx as React.CSSProperties),
                            maxWidth: maxWidths[index],
                        },
                    },
                },
                outerSizes[index]
            )
        ),
    ];

    if (preferredHeight === undefined || !rootSize.width) {
        return { nodes, isWrapping };
    }

    let left = rootNode.position.x - rootRadius;
    let right = rootNode.position.x + rootRadius;
    let top = rootNode.position.y - rootRadius;
    let bottom = rootNode.position.y + rootRadius;

    outerNodes.forEach((node, index) => {
        const size = outerSizes[index];
        const boxLeft =
            node.position.x - (node.origin?.[0] ?? 0.5) * size.width;

        left = Math.min(left, boxLeft);
        right = Math.max(right, boxLeft + size.width);
        top = Math.min(top, ys[index] - size.height / 2);
        bottom = Math.max(bottom, ys[index] + size.height / 2);
    });

    const contentWidth = right - left;
    const contentDepth = bottom - top;
    const zoomByHeight = preferredHeight / (contentDepth * (1 + FIT_PADDING));
    const zoom = Math.min(
        isWrapping ? MIN_ZOOM : MAX_ZOOM,
        width / (contentWidth * (1 + FIT_PADDING)),
        Math.max(MIN_ZOOM, zoomByHeight)
    );
    const fittedHeight = (contentDepth + contentWidth * FIT_PADDING) * zoom;

    return {
        nodes,
        isWrapping,
        contentHeight: Math.ceil(
            zoomByHeight >= MIN_ZOOM
                ? Math.min(preferredHeight, fittedHeight)
                : fittedHeight
        ),
    };
};

export const getStackedLayout = ({
    rootNode,
    outerNodes,
    rootSize,
    outerSizes,
    width,
}: LayoutInput): MindMapLayout => {
    const rootRadius = STACKED_ROOT_SIZE / 2;
    const indent = rootRadius + STACK_GAP * 2;
    const boxWidth = width / (1 + FIT_PADDING) - rootRadius - indent;

    let y = -rootRadius;

    const stackedNodes = outerNodes.map((node, index) => {
        if (
            index > 0 &&
            isRightOf(rootNode, node) !==
                isRightOf(rootNode, outerNodes[index - 1])
        ) {
            y += GROUP_GAP - STACK_GAP;
        }

        const stackedNode = withMeasured(
            {
                ...node,
                origin: [0, 0] as [number, number],
                position: { x: indent, y },
                data: {
                    ...node.data,
                    position: Position.Left,
                    nodeSx: {
                        ...(node.data.nodeSx as React.CSSProperties),
                        width: boxWidth,
                    },
                },
            },
            { width: boxWidth, height: outerSizes[index].height }
        );

        y += outerSizes[index].height + STACK_GAP;

        return stackedNode;
    });

    return {
        nodes: [
            withMeasured(
                {
                    ...rootNode,
                    data: { ...rootNode.data, size: STACKED_ROOT_SIZE },
                },
                rootSize
            ),
            ...stackedNodes,
        ],
        isWrapping: false,
        contentHeight: Math.ceil(
            rootRadius +
                Math.max(y - STACK_GAP, rootRadius) +
                (width * FIT_PADDING) / (1 + FIT_PADDING)
        ),
    };
};
