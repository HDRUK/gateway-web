import type { Meta, StoryObj } from "@storybook/react";
import InitialsBadgeComponent from "@/components/InitialsBadge";
import Form from "@/components/Form";
import React from "react";
import { Stack } from "@mui/material";
import { generateFullName } from "../../../mocks/data/generic";

const meta: Meta<typeof InitialsBadgeComponent> = {
    component: InitialsBadgeComponent,
};

export default meta;

type Story = StoryObj<typeof Form>;

export const InitialsBadge: Story = {
    render: () => (
        <Stack direction="row" gap={2}>
            <InitialsBadgeComponent fullName={generateFullName()} />
            <InitialsBadgeComponent initials="LB" />
        </Stack>
    ),
};
