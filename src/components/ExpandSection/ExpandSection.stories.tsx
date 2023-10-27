import type { Meta, StoryObj } from "@storybook/react";
import Typography from "@/components/Typography";
import ExpandSection, { ExpandSectionProps } from "./ExpandSection";

const meta: Meta<typeof ExpandSection> = {
    component: ExpandSection,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ExpandSection>;

export const Default: Story = {
    args: {
        heading: (
            <>
                <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Risus et
                </Typography>{" "}
                pharetra fringill
            </>
        ),
        listItems: [
            "Cras ut sem eu ligula tincidunt aliquet",
            "Lorem ipsum dolor sit amet",
            "Nullam maximus risus et pharetra fringill",
            "Suspendisse porttitor tortor et lectus pulvinar",
        ],
    },
    render: (props: ExpandSectionProps) => <ExpandSection {...props} />,
};

export const ShowLess: Story = {
    args: {
        showLessButton: true,
        heading: (
            <>
                <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Risus et
                </Typography>{" "}
                pharetra fringill
            </>
        ),
        listItems: [
            "Cras ut sem eu ligula tincidunt aliquet",
            "Lorem ipsum dolor sit amet",
            "Nullam maximus risus et pharetra fringill",
            "Suspendisse porttitor tortor et lectus pulvinar",
        ],
    },
    render: (props: ExpandSectionProps) => <ExpandSection {...props} />,
};
