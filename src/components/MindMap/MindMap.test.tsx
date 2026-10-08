import { Node, Position } from "@xyflow/react";
import MindMap from "@/components/MindMap";
import { MindMapProps } from "@/components/MindMap/MindMap";
import { act, render, screen, within } from "@/utils/testUtils";

const rootNode = {
    id: "root",
    type: "circle",
    position: { x: 0, y: 0 },
    initialWidth: 100,
    initialHeight: 100,
    data: { id: 0, label: "Test Map" },
};

const rectNode = (
    label: string,
    x: number,
    y: number,
    overrides: Partial<Node> = {}
): Node => ({
    id: `node-${label}`,
    type: "rect",
    position: { x, y },
    initialWidth: 120,
    initialHeight: 40,
    data: {
        id: label,
        label,
        href: "/",
        position: Position.Left,
        color: "red",
    },
    ...overrides,
});

const renderMindMap = (props: Partial<MindMapProps> = {}) => {
    const result = render(
        <MindMap
            rootNode={rootNode}
            outerNodes={[]}
            initialEdges={[]}
            connectionLineStyle={{}}
            {...props}
        />
    );

    act(() => {
        jest.runOnlyPendingTimers();
    });

    return result;
};

describe("MindMap", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should render component", async () => {
        const connectionLineStyle = {
            stroke: "rgb(226, 226, 226)",
            strokeWidth: 3,
        };
        const rootNode = {
            id: "root",
            type: "circle",
            position: { x: 0, y: 0 },
            data: { id: 0, label: "Test Map", href: "/" },
        };

        const outerNodes = [
            {
                id: `node-0`,
                type: "rect",
                position: { x: 100, y: 100 },
                data: {
                    id: 0,
                    label: "my node",
                    position: Position.Left,
                    color: "red",
                },
            },
        ];

        const initialEdges = [
            {
                id: `e1-0`,
                source: "root",
                target: `node-0`,
            },
        ];

        render(
            <MindMap
                rootNode={rootNode}
                outerNodes={outerNodes}
                initialEdges={initialEdges}
                connectionLineStyle={connectionLineStyle}
            />
        );

        expect(screen.queryByText("my node")).toBeInTheDocument();
    });

    it("should order links top to bottom, right side first", () => {
        renderMindMap({
            outerNodes: [
                rectNode("bottom right", 100, 100),
                rectNode("bottom left", -100, 100),
                rectNode("top right", 100, -100),
                rectNode("top left", -100, -100),
            ],
        });

        expect(
            screen
                .getAllByRole("link")
                .map(link =>
                    link.textContent?.replace("(opens in a new tab)", "")
                )
        ).toEqual(["top right", "bottom right", "top left", "bottom left"]);
    });

    it("should announce that links open in a new tab", () => {
        renderMindMap({ outerNodes: [rectNode("Collections", 100, 0)] });

        const link = screen.getByRole("link");

        expect(link).toHaveTextContent("Collections");
        expect(
            within(link).getByText("(opens in a new tab)")
        ).toBeInTheDocument();
    });

    it("should prefix a label for screen readers", () => {
        renderMindMap({
            outerNodes: [
                rectNode("Gut Reaction", -100, 0, {
                    data: {
                        id: "custodian",
                        label: "Gut Reaction",
                        labelPrefix: "Data Custodian",
                        href: "/",
                        position: Position.Right,
                        color: "blue",
                    },
                }),
            ],
        });

        const link = screen.getByRole("link");

        expect(within(link).getByText("Data Custodian:")).toBeInTheDocument();
        expect(link).toHaveTextContent("Gut Reaction");
    });

    it("should not render hidden arms", () => {
        renderMindMap({
            outerNodes: [
                rectNode("shown", 100, 0),
                rectNode("not shown", -100, 0, { hidden: true }),
            ],
        });

        expect(screen.getByText("shown")).toBeInTheDocument();
        expect(screen.queryByText("not shown")).not.toBeInTheDocument();
    });

    it("should show the labelled diagram", () => {
        renderMindMap({ "aria-label": "Explore this dataset" });

        const diagram = screen.getByRole("group", {
            name: "Explore this dataset",
        });

        expect(diagram).toBeVisible();
    });

    it("should not give screen readers React Flow keyboard instructions", () => {
        renderMindMap({ outerNodes: [rectNode("arm", 100, 0)] });

        expect(
            screen.queryByText(/press enter or space/i)
        ).not.toBeInTheDocument();
    });

    it("should not make nodes focusable, selectable or connectable", () => {
        const { container } = renderMindMap({
            outerNodes: [rectNode("arm", 100, 0)],
        });

        const nodes = container.querySelectorAll(".react-flow__node");
        const handles = container.querySelectorAll(".react-flow__handle");

        expect(nodes).toHaveLength(2);
        nodes.forEach(node => {
            expect(node).not.toHaveAttribute("tabindex");
            expect(node).not.toHaveClass("selectable");
        });
        expect(handles).toHaveLength(2);
        handles.forEach(handle => {
            expect(handle).not.toHaveClass("connectablestart");
        });
    });

    it("should size the circle from its data", () => {
        const { container, rerender } = renderMindMap();

        const circle = () =>
            container.querySelector(".react-flow__node-circle > div");

        expect(circle()).toHaveStyle({ width: "100px", height: "100px" });

        rerender(
            <MindMap
                rootNode={{ ...rootNode, data: { ...rootNode.data, size: 80 } }}
                outerNodes={[]}
                initialEdges={[]}
                connectionLineStyle={{}}
            />
        );

        expect(circle()).toHaveStyle({ width: "80px", height: "80px" });
    });
});
