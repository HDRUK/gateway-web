import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Option } from "@/interfaces/Option";
import Form from "@/components/Form";
import SelectMultipleOption from "./SelectMultipleOption";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/SelectMultipleOption",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Form>;

export type FormData = {
    first: string;
};

const WrapperComponent = () => {
    const [options, setOptions] = useState<Option[]>([
        {
            value: "first",
            label: "First",
        },
    ]);

    return (
        <SelectMultipleOption
            id={1}
            option={options[0]}
            setOptions={setOptions}
        />
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
