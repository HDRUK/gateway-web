import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Meta, StoryObj } from "@storybook/react";
import * as yup from "yup";
import { Option } from "@/interfaces/Option";
import Button from "@/components/Button";
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

const validationSchema = yup
    .object({
        first: yup.string().required().label("First"),
    })
    .required();

const WrapperComponent = () => {
    const { handleSubmit, control } = useForm<FormData>({
        defaultValues: {
            first: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = data => console.log(data);

    const [options, setOptions] = useState<Option[]>([
        { label: "Option 1", value: "option1" },
    ]);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <SelectMultipleOptions options={options} setOptions={setOptions} />

            <Button type="submit">Submit</Button>
        </Form>
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
