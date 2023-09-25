import type { Meta, StoryObj } from "@storybook/react";
import ProviderLinks from "./ProviderLinks";

const meta: Meta<typeof ProviderLinks> = {
    component: ProviderLinks,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ProviderLinks>;

export const Default: Story = {};
