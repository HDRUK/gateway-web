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
            filterItems={[
                { value: "1", label: "course 1" },
                { value: "2", label: "course 2" },
                { value: "3", label: "course 3" },
                { value: "4", label: "course 4" },
                { value: "5", label: "course 5" },
                { value: "6", label: "course 6" },
            ]}
            filterSection="course"
            setValue={setValue}
            control={control}
        />
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
