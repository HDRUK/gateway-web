import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Option } from "@/interfaces/Option";
import Form from "@/components/Form";
import SelectMultipleOptions from "./SelectMultipleOptions";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/SelectMultipleOptions",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Form>;

export type FormData = {
    first: string;
};

const WrapperComponent = () => {
    const [options, setOptions] = useState<Option[]>([
        { label: "Option 1", value: "option1" },
    ]);

    return <SelectMultipleOptions options={options} setOptions={setOptions} />;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
