import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";

const meta: Meta<typeof Header> = {
    component: Header,
    title: "Layout/Header",
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};
