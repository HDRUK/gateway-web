import type { Meta, StoryObj } from "@storybook/react";
import NewsSummaryCard from "@/components/NewsSummaryCard";

const meta: Meta<typeof NewsSummaryCard> = {
    component: NewsSummaryCard,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof NewsSummaryCard>;

export const Default: Story = {
    args: {
        buttonText: "Read more",
        headline: "This is a headline",
        summary:
            "Cras ut sem eu ligula tincidunt aliquet. Lorem ipsum dolor sit amet. Nullam maximus risus et pharetra fringill. Suspendisse porttitor tortor et lectus pulvinar",
        date: "2023-01-01",
        url: "https://www.healthdatagateway.org/",
        imageLink: "/images/account/teams/integrations/create.jpg",
        imageAlt: "Image alt text",
    },
};
