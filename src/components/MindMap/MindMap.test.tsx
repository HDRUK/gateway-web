import { Position } from "reactflow";
import MindMap from "@/components/MindMap";
import { render, screen } from "@/utils/testUtils";

describe("MindMap", () => {
    it("should render component", async () => {
        const connectionLineStyle = { stroke: "black", strokeWidth: 3 };
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
});
