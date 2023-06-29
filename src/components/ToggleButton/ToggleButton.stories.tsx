import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import ToggleButton from "./ToggleButton";

const meta: Meta<typeof ToggleButton> = {
    component: ToggleButton,
    title: "AppComponent/ToggleButton",
};

export default meta;

type Story = StoryObj<typeof ToggleButton>;

const toggleLabels = {
    checkedLabel: "On",
    unCheckedLabel: "Off",
};

const DummyComp = () => {
    const [checked, setChecked] = useState(false);
    return (
        <>
            <ToggleButton
                {...toggleLabels}
                onChange={e => setChecked(e.target.checked)}
            />
            {checked ? (
                <h4>The Toggle button is checked</h4>
            ) : (
                <h4>The Toggle button is NOT checked</h4>
            )}
        </>
    );
};

export const SquareButtonDemo: Story = {
    render: () => <DummyComp />,
};
