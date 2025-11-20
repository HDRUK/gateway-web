import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/nextjs";
import NestedFilterSection from "./NestedFilterSection";

const meta: Meta<typeof NestedFilterSection> = {
    component: NestedFilterSection,
    title: "Search/NestedFilterSection",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof NestedFilterSection>;
const WrapperComponent = () => {
    const { setValue, control } = useForm<{ [key: string]: string }>({
        defaultValues: { course: "" },
    });

    return (
        <NestedFilterSection
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
