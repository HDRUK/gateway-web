import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";
import FilterSection from "./FilterSection";

const meta: Meta<typeof FilterSection> = {
    component: FilterSection,
    title: "Search/FilterSection",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FilterSection>;
const WrapperComponent = () => {
    const { setValue, control } = useForm<{ course: string }>({
        defaultValues: { course: "" },
    });

    return (
        <FilterSection
            checkboxValues={{}}
            handleCheckboxChange={() => console.log("change")}
            filterItem={{
                buckets: [
                    {
                        value: "filter1",
                        label: "filter 1",
                        count: 5,
                    },
                    {
                        value: "filter2",
                        label: "filter 2",
                        count: 10,
                    },
                ],
                value: "1",
                label: "course 1",
            }}
            filterSection="course"
            setValue={setValue}
            control={control}
        />
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
