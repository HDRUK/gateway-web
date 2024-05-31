import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Meta, StoryObj } from "@storybook/react";
import * as yup from "yup";
import Button from "@/components/Button";
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

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <SelectMultipleOption
                label="is required"
                required
                control={control}
                name="first"
            />

            <Button type="submit">Submit</Button>
        </Form>
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
