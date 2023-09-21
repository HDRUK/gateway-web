import type { Meta, StoryObj } from "@storybook/react";
import Link from "./Link";

/** Mui documentation: https://mui.com/material-ui/react-link */
/** NextJs documentation: https://nextjs.org/docs/pages/api-reference/components/link */

const meta: Meta<typeof Link> = {
    component: Link,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
    args: {
        href: "/",
        children: "Link",
    },
};
