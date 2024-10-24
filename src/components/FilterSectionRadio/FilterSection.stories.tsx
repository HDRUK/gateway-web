import type { Meta, StoryObj } from "@storybook/react";
import FilterSectionRadio from "./FilterSectionRadio";

const meta: Meta<typeof FilterSectionRadio> = {
    component: FilterSectionRadio,
    title: "Search/FilterSectionRadio",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FilterSectionRadio>;
const WrapperComponent = () => {
    return (
        <FilterSectionRadio
            handleRadioChange={() => console.log("change radio")}
            filterItem={{
                buckets: [
                    {
                        value: "FED",
                        label: "Search Online Publications",
                    },
                    {
                        value: "GAT",
                        label: "Search Gateway",
                    },
                ],
                label: "source",
                value: "",
            }}
        />
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
