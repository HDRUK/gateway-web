import type { Meta, StoryObj } from "@storybook/react";
import CheckboxComponent from "@/components/Checkbox";
import { Stack } from "@mui/material";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/Button";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/Checkbox",
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
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 240 }}>
                <CheckboxComponent
                    label="Simple Checkbox"
                    control={control}
                    name="first"
                />
                <CheckboxComponent
                    label="Required Checkbox"
                    required
                    control={control}
                    name="second"
                />
                <CheckboxComponent
                    label="Disabled Checkbox"
                    disabled
                    control={control}
                    name="third"
                />
                <CheckboxComponent
                    label="indeterminate Checkbox"
                    indeterminate
                    control={control}
                    name="fourth"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Checkbox: Story = {
    render: () => <DummyComponent />,
};
