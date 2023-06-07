import type { Meta, StoryObj } from "@storybook/react";
import Checkbox from "@/components/Checkbox";
import { Stack } from "@mui/material";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import React from "react";
import Button from "../Button/Button";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/Checkbox",
};

export default meta;

type Story = StoryObj<typeof Form>;

export type FormData = {
    first: string;
    second: string;
    third: string;
    fourth: string;
    fifth: string;
};

const DummyComponent = () => {
    const { handleSubmit, control } = useForm<FormData>({
        defaultValues: {
            first: "",
            second: "",
            third: "",
        },
    });

    const onSubmit = (data: unknown) => console.log(data);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 240 }}>
                <Checkbox
                    label="Simple Checkbox"
                    control={control}
                    name="second"
                />
                <Checkbox
                    label="Required Checkbox"
                    rules={{ required: true }}
                    control={control}
                    name="first"
                />
                <Checkbox
                    label="Disabled Checkbox"
                    disabled
                    control={control}
                    name="second"
                />
                <Checkbox
                    label="indeterminate Checkbox"
                    indeterminate
                    control={control}
                    name="third"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Checkbox1: Story = {
    render: () => <DummyComponent />,
};
