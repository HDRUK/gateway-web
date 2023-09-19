import type { Meta, StoryObj } from "@storybook/react";
import CheckboxRowComponent from "@/components/CheckboxRow";
import { Stack } from "@mui/material";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/Button";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/CheckboxRow",
};

export default meta;

type Story = StoryObj<typeof Form>;

export type FormData = {
    first: string;
    second: boolean;
    third: string;
    fourth: string;
};

const validationSchema = yup
    .object({
        second: yup.boolean().required().oneOf([true]),
    })
    .required();

const DummyComponent = () => {
    const { handleSubmit, control } = useForm<FormData>({
        defaultValues: {
            first: "",
            second: false,
            third: "",
            fourth: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: unknown) => console.log(data);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 400 }}>
                <CheckboxRowComponent
                    label="Simple Checkbox"
                    control={control}
                    name="first"
                    title="Title"
                />
                <CheckboxRowComponent
                    label="Required Checkbox"
                    required
                    control={control}
                    name="second"
                    title="Title"
                />
                <CheckboxRowComponent
                    label="Disabled Checkbox"
                    disabled
                    control={control}
                    name="third"
                    title="Title"
                />
                <CheckboxRowComponent
                    label="indeterminate Checkbox"
                    indeterminate
                    control={control}
                    name="fourth"
                    title="Title"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const CheckboxRow: Story = {
    render: () => <DummyComponent />,
};
