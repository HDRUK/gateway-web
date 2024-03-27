import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import * as yup from "yup";
import Button from "@/components/Button";
import CheckboxRow from "@/components/CheckboxRow";
import Form from "@/components/Form";

/** Mui documentation: https://mui.com/material-ui/react-checkbox */

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/CheckboxRow",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Form>;

export type FormData = {
    [key: string]: string;
};

const validationSchema = yup
    .object({
        second: yup.boolean().required().oneOf([true]),
    })
    .required();

const WrapperComponent = () => {
    const { handleSubmit, control } = useForm<FormData>({
        defaultValues: {
            first: "",
            second: "",
            third: "",
            fourth: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: unknown) => console.log(data);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 400 }}>
                <CheckboxRow
                    label="Simple Checkbox"
                    control={control}
                    name="first"
                    title="Title"
                />
                <CheckboxRow
                    label="Required Checkbox"
                    required
                    control={control}
                    name="second"
                    title="Title"
                />
                <CheckboxRow
                    label="Disabled Checkbox"
                    disabled
                    control={control}
                    name="third"
                    title="Title"
                />
                <CheckboxRow
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

export const Default: Story = {
    render: () => <WrapperComponent />,
};
