import type { Meta, StoryObj } from "@storybook/react";
import {
    rootNode,
    outerNodes,
    initialEdges,
    connectionLineStyle,
} from "@/config/mindmaps/dataset";
import MindMap from "./MindMap";

const meta: Meta<typeof MindMap> = {
    component: MindMap,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MindMap>;

const WrapperComponent = () => {
    return (
        <div>
            <MindMap
                rootNode={rootNode}
                outerNodes={outerNodes}
                initialEdges={initialEdges}
                connectionLineStyle={connectionLineStyle}
            />
        </div>
    );
};

export const Single: Story = {
    render: () => <WrapperComponent />,
};
