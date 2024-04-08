import type { Meta, StoryObj } from "@storybook/react";
import InfoHoverPanel from "./InfoHoverPanel";

const meta: Meta<typeof InfoHoverPanel> = {
    component: InfoHoverPanel,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof InfoHoverPanel>;

export const Default: Story = {
    args: {
        items: [
            {
                id: "datasets",
                image: "/images/homepage/welcome-image.png",
                href: "/search?type=datasets",
            },
            {
                id: "dur",
                image: "/images/homepage/welcome-image.png",
                href: "/search?type=dur",
            },
        ],
    },
};
