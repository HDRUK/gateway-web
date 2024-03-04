import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/Button";
import MenuDropdown from "./MenuDropdown";

const meta: Meta<typeof MenuDropdown> = {
    component: MenuDropdown,
    title: "Layout/MenuDropdown",
    tags: ["autodocs"],
};

export default meta;

const menu = [
    {
        label: "label 1",
        href: "/",
        subItems: [{ label: "sub item label 1", href: "/" }],
    },
];

const WrapperComponent = () => {
    const [anchorElement, setAnchorElement] =
        React.useState<null | HTMLElement>(null);

    return (
        <>
            <Button onClick={event => setAnchorElement(event.currentTarget)}>
                Open menu
            </Button>
            <MenuDropdown
                handleClose={() => setAnchorElement(null)}
                menuItems={menu}
                anchorElement={anchorElement}
            />
        </>
    );
};

type Story = StoryObj<typeof MenuDropdown>;

export const Default: Story = {
    render: () => <WrapperComponent />,
};
