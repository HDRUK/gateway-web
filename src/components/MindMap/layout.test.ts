import { Node, Position } from "@xyflow/react";
import {
    STACKED_ROOT_SIZE,
    STACK_BELOW_WIDTH,
    getRadialLayout,
    getStackedLayout,
    isStackedWidth,
    orderOuterNodes,
} from "./layout";

const rootNode: Node = {
    id: "root",
    type: "circle",
    position: { x: 0, y: 0 },
    data: { id: 0, label: "Dataset" },
};

const rectNode = (
    id: string,
    x: number,
    y: number,
    overrides: Partial<Node> = {}
): Node => ({
    id,
    type: "rect",
    position: { x, y },
    origin: x >= 0 ? [0, 0.5] : [1, 0.5],
    data: { id, label: id, position: Position.Left, color: "red" },
    ...overrides,
});

const rootSize = { width: 100, height: 100 };

const top = (node: Node, height: number) => node.position.y - height / 2;

describe("orderOuterNodes", () => {
    it("orders the right side top to bottom, then the left side", () => {
        const ordered = orderOuterNodes(rootNode, [
            rectNode("right bottom", 100, 50),
            rectNode("left top", -100, -50),
            rectNode("right top", 100, -50),
            rectNode("left bottom", -100, 50),
        ]);

        expect(ordered.map(node => node.id)).toEqual([
            "right top",
            "right bottom",
            "left top",
            "left bottom",
        ]);
    });

    it("drops hidden nodes", () => {
        const ordered = orderOuterNodes(rootNode, [
            rectNode("shown", 100, 0),
            rectNode("hidden", 100, 50, { hidden: true }),
        ]);

        expect(ordered.map(node => node.id)).toEqual(["shown"]);
    });
});

describe("isStackedWidth", () => {
    it("stacks only below the breakpoint, once a width is known", () => {
        expect(isStackedWidth(0)).toBe(false);
        expect(isStackedWidth(STACK_BELOW_WIDTH - 1)).toBe(true);
        expect(isStackedWidth(STACK_BELOW_WIDTH)).toBe(false);
    });
});

describe("getRadialLayout", () => {
    it("pushes overlapping boxes in a column apart", () => {
        const outerNodes = [rectNode("a", 100, 0), rectNode("b", 100, 10)];
        const outerSizes = [
            { width: 120, height: 60 },
            { width: 120, height: 60 },
        ];

        const { nodes } = getRadialLayout({
            rootNode,
            outerNodes,
            rootSize,
            outerSizes,
            width: 900,
            preferredHeight: 370,
        });
        const [, first, second] = nodes;

        expect(top(second, 60)).toBeGreaterThanOrEqual(top(first, 60) + 60);
    });

    it("gives a side the width the other side does not need", () => {
        const outerNodes = [
            rectNode("long", 100, 0),
            rectNode("short", -100, 0),
        ];
        const outerSizes = [
            { width: 0, height: 0 },
            { width: 80, height: 40 },
        ];

        const { nodes } = getRadialLayout({
            rootNode,
            outerNodes,
            rootSize,
            outerSizes,
            width: 660,
        });
        const half = 660 / 1.1 / 2;
        const longMaxWidth = (nodes[1].data.nodeSx as React.CSSProperties)
            .maxWidth as number;

        expect(longMaxWidth).toBeGreaterThan(half - 100);
    });

    it("does not zoom above 1 when a box has to wrap", () => {
        const outerNodes = [rectNode("long", 100, 0)];
        const width = 600;
        const maxWidth = width / 1.1 - rootSize.width / 2 - 100;

        const { isWrapping, contentHeight } = getRadialLayout({
            rootNode,
            outerNodes,
            rootSize,
            outerSizes: [{ width: maxWidth, height: 90 }],
            width,
            preferredHeight: 370,
        });

        expect(isWrapping).toBe(true);
        expect(contentHeight).toBeLessThan(370);
    });

    it("keeps to the preferred height when the content is short", () => {
        const { contentHeight } = getRadialLayout({
            rootNode,
            outerNodes: [rectNode("a", 100, 0)],
            rootSize,
            outerSizes: [{ width: 100, height: 40 }],
            width: 2000,
            preferredHeight: 370,
        });

        expect(contentHeight).toBeLessThanOrEqual(370);
    });
});

describe("getStackedLayout", () => {
    const outerNodes = [
        rectNode("right top", 100, -50),
        rectNode("right bottom", 100, 50),
        rectNode("left", -100, 0),
    ];
    const outerSizes = [
        { width: 0, height: 50 },
        { width: 0, height: 50 },
        { width: 0, height: 50 },
    ];

    const { nodes, contentHeight } = getStackedLayout({
        rootNode,
        outerNodes,
        rootSize,
        outerSizes,
        width: 400,
    });
    const [root, ...boxes] = nodes;

    it("shrinks the circle", () => {
        expect(root.data.size).toBe(STACKED_ROOT_SIZE);
    });

    it("lines the boxes up in one column, in order", () => {
        expect(new Set(boxes.map(box => box.position.x)).size).toBe(1);
        expect(boxes.map(box => box.id)).toEqual([
            "right top",
            "right bottom",
            "left",
        ]);
        expect(boxes[1].position.y).toBeGreaterThan(boxes[0].position.y);
    });

    it("separates the two groups with a larger gap", () => {
        const withinGroup = boxes[1].position.y - boxes[0].position.y;
        const betweenGroups = boxes[2].position.y - boxes[1].position.y;

        expect(betweenGroups).toBeGreaterThan(withinGroup);
    });

    it("sizes the diagram to its content", () => {
        expect(contentHeight).toBeGreaterThan(3 * 50);
    });
});
