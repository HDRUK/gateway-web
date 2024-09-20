import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import InfoBanner from "./InfoBanner";

const meta = {
    component: InfoBanner,
    tags: ["autodocs"],
} satisfies Meta<typeof InfoBanner>;

export default meta;

type Story = StoryObj<typeof InfoBanner>;

export const Default: Story = {
    args: {
        action: (
            <Button variant="contained" color="greyCustom">
                Read more
            </Button>
        ),
        message: "Out now! June update",
        isDismissable: true,
    },
};
