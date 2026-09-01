import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "@hdruk/ui";
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
            <Button color="greyCustom">
                Read more
            </Button>
        ),
        message: "Out now! June update",
        isDismissable: true,
    },
};
