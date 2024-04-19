import type { Meta, StoryObj } from "@storybook/react";
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
            <MindMap test="hi" key="hi" />
        </div>
    );
};

export const Single: Story = {
    render: () => <WrapperComponent />,
};
