import type { Meta, StoryObj } from "@storybook/nextjs";
import Footer from "./Footer";

const meta: Meta<typeof Footer> = {
    component: Footer,
    title: "Layout/Footer",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
