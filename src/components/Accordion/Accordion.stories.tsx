import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Accordion from "./Accordion";

const meta: Meta<typeof Accordion> = {
    component: Accordion,
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const WrapperComponent = () => {
    const [expanded, setExpanded] = useState<number | null>(null);

    const handleChange = (isExpanded: boolean, panel: number) => {
        setExpanded(isExpanded ? panel : null);
    };

    return (
        <div>
            {Array.from({ length: 3 }).map((e, index: number) => (
                <Accordion
                    expanded={expanded === index}
                    heading={`Heading ${index}`}
                    contents={`Content ${index}`}
                    onChange={(event, isExpanded) =>
                        handleChange(isExpanded, index)
                    }
                />
            ))}
        </div>
    );
};

const Heading = () => <div>This is a Heading</div>;
const Content = () => <div>This is some Content</div>;

export const Single: Story = {
    render: () => <Accordion heading={<Heading />} contents={<Content />} />,
};

export const Group: Story = {
    render: () => <WrapperComponent />,
};
