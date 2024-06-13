import { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Link from "@/components//Link";
import ConditionalWrapper from "./ConditionalWrapper";

const meta: Meta<typeof ConditionalWrapper> = {
    component: ConditionalWrapper,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ConditionalWrapper>;

const wrapperFn = (href: string) => (children: ReactNode) => {
    return <Link href={href}>{children}</Link>;
};

export const Default: Story = {
    args: {
        requiresWrapper: true,
        wrapper: wrapperFn("this/is/a/href"),
        children: <div>this is child content</div>,
    },
};
