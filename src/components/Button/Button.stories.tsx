// Button.stories.ts

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from "@storybook/react";

import Button from "./Button";

const meta: Meta<typeof Button> = {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: "Button",
    component: Button,
    argTypes: {
        variant: {
            options: ["contained", "outlined", "text"],
            control: { type: "radio" },
        },
        color: {
            options: ["primary", "secondary"],
            control: { type: "radio" },
        },
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Color: Story = {
    render: () => (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
            }}>
            <Button color="primary">Primary button</Button>
            <Button color="secondary">Secondary button</Button>
        </div>
    ),
};
export const Variant: Story = {
    render: () => (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
            }}>
            <Button variant="contained">Contained button</Button>
            <Button variant="outlined">Outlined button</Button>
            <Button variant="text">Text button</Button>
        </div>
    ),
};
