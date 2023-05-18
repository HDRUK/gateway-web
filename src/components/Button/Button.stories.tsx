import type { Meta, StoryObj } from "@storybook/react";
import Stack from "@mui/material/Stack";
import Button, { ButtonProps } from "./Button";

const meta: Meta<typeof Button> = {
    component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Playground = (args: ButtonProps) => <Button {...args} />;
Playground.args = {
    children: "I'm a button",
};

export const Color: Story = {
    render: () => (
        <Stack spacing={2} maxWidth={300}>
            <Button color="inherit">Inherit</Button>
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="success">Success</Button>
            <Button color="error">Error</Button>
            <Button color="info">Info</Button>
            <Button color="warning">Warning</Button>
        </Stack>
    ),
};
export const Size: Story = {
    render: () => (
        <Stack spacing={2} maxWidth={300}>
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
        </Stack>
    ),
};
export const Variant: Story = {
    render: () => (
        <Stack spacing={2} maxWidth={300}>
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
        </Stack>
    ),
};
