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
            heasing: "Accordion 1",
            details: "Accordion 1 details",
        },
        {
            id: "panel2",
            heasing: "Accordion 2",
            details: "Accordion 2 details",
        },
        {
            id: "panel3",
            heasing: "Accordion 3",
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
                    heasing: string;
                    details: string;
                }) => (
                    <Accordion
                        expanded={expanded === accordion.id}
                        heading={accordion.heasing}
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

export const SimpleAccordion: Story = {
    render: (props: AccordionProps) => <Accordion {...props} />,
};

export const AccordionGroup: Story = {
    render: () => <DummyComponent />,
};
