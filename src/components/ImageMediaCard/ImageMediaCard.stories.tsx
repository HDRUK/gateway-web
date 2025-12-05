import type { Meta, StoryObj } from "@storybook/nextjs";
import ImageMediaCard from "./ImageMediaCard";

const meta: Meta<typeof ImageMediaCard> = {
    component: ImageMediaCard,
    title: "Cards/ImageMediaCard",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ImageMediaCard>;

export const Default: Story = {
    args: {
        description: "Description here",
        img: "https://place-hold.it/300x250",
        buttonText: "Button label",
        href: "/",
    },
};
