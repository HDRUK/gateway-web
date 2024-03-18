import type { Meta, StoryObj } from "@storybook/react";
import IFrameContainer from "@/components/IFrameContainer";

const meta: Meta<typeof IFrameContainer> = {
    component: IFrameContainer,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof IFrameContainer>;

export const Default: Story = {
    args: {
        children: <iframe title="demo iframe" />,
    },
};
