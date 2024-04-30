import type { Meta, StoryObj } from "@storybook/react";
import {
    rootNode,
    outerNodes,
    initialEdges,
    connectionLineStyle,
} from "@/config/mindmaps/dataset";
import MindMap, { MindMapProps } from "./MindMap";

const meta: Meta<typeof MindMap> = {
    component: MindMap,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MindMap>;

const WrapperComponent = (props: MindMapProps) => {
    return (
        <div style={{ height: "350px" }}>
            <MindMap {...props} />
        </div>
    );
};

export const Single: Story = {
    render: () => (
        <WrapperComponent
            rootNode={rootNode}
            outerNodes={outerNodes}
            initialEdges={initialEdges}
            connectionLineStyle={connectionLineStyle}
            fitView
        />
    ),
};
