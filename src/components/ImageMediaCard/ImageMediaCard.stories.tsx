import type { Meta, StoryObj } from "@storybook/react";
import ImageMediaCard from "./ImageMediaCard";

const meta: Meta<typeof ImageMediaCard> = {
    component: ImageMediaCard,
};

export default meta;

type Story = StoryObj<typeof ImageMediaCard>;

const WrapperComponent = () => {
    return null;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
