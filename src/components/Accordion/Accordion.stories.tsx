import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Accordion from "./Accordion";

const meta: Meta<typeof Accordion> = {
    component: Accordion,
    tags: ["autodocs"],
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
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
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

export const Single: Story = {
    args: {
        heading: <div>This is a Heading</div>,
        contents: <div>This is contents</div>,
    },
};

export const Group: Story = {
    render: () => <WrapperComponent />,
};
