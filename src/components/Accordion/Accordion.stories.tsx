import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Accordion, { AccordionProps } from "./Accordion";

const meta: Meta<typeof Accordion> = {
    component: Accordion,
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const DummyComponent = () => {
    const [expanded, setExpanded] = useState<string | false>(false);
    const accordionData = [
        {
            id: "panel1",
            heading: "Accordion 1",
            details: "Accordion 1 details",
        },
        {
            id: "panel2",
            heading: "Accordion 2",
            details: "Accordion 2 details",
        },
        {
            id: "panel3",
            heading: "Accordion 3",
            details: "Accordion 3 details",
        },
    ];

    const handleChange = (isExpanded: boolean, panel: string) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div>
            {accordionData.map(
                (accordion: {
                    id: string;
                    heading: string;
                    details: string;
                }) => (
                    <Accordion
                        expanded={expanded === accordion.id}
                        heading={accordion.heading}
                        contents={accordion.details}
                        onChange={(event, isExpanded) =>
                            handleChange(isExpanded, accordion.id)
                        }
                    />
                )
            )}
        </div>
    );
};

const Heading = () => <div>React Element as Heading</div>;
const Content = () => <div>React Element as Content</div>;

export const SimpleAccordion: Story = {
    render: (props: AccordionProps) => <Accordion {...props} />,
};

export const AccordionGroup: Story = {
    render: () => <DummyComponent />,
};

export const ReactElementAccordion: Story = {
    render: () => <Accordion heading={<Heading />} contents={<Content />} />,
};
