import type { Meta, StoryObj } from "@storybook/nextjs";
import messages from "@/config/messages/en.json";
import {
    rootNode,
    outerNodeValues,
    getOuterNodes,
    initialEdges,
    connectionLineStyle,
} from "@/config/mindmaps/dataset";
import MindMap from "./MindMap";

const labels = messages.pages.dataset.components.DatasetMindMap;

const outerNodes = getOuterNodes(
    outerNodeValues.map(node => ({
        ...node,
        label: labels[node.name as keyof typeof labels],
        href: node.href ?? (node.cohort ? undefined : "#"),
    }))
);

const labelledRootNode = {
    ...rootNode,
    data: { ...rootNode.data, label: "Dataset" },
};

const meta: Meta<typeof MindMap> = {
    component: MindMap,
    tags: ["autodocs"],
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
};

export default meta;

type Story = StoryObj<typeof MindMap>;

export const Single: Story = {
    render: () => (
        <MindMap
            rootNode={labelledRootNode}
            outerNodes={outerNodes}
            initialEdges={initialEdges}
            connectionLineStyle={connectionLineStyle}
            preferredHeight={370}
            fitView
        />
    ),
};
