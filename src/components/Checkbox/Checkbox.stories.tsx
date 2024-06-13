import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import * as yup from "yup";
import Button from "@/components/Button";
import CheckboxComponent from "@/components/Checkbox";
import Form from "@/components/Form";

/** Mui documentation: https://mui.com/material-ui/react-checkbox/ */
/** React Hook Form documentation: https://react-hook-form.com/ */

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/Checkbox",
    tags: ["autodocs"],
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

const WrapperComponent = () => {
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

const WrapperComponentWithCount = () => {
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
                    count={34}
                    name="first"
                />
                <CheckboxComponent
                    label="Required Checkbox"
                    required
                    control={control}
                    count={23}
                    name="second"
                />
                <CheckboxComponent
                    label="Disabled Checkbox"
                    disabled
                    control={control}
                    count={2}
                    name="third"
                />
                <CheckboxComponent
                    label="indeterminate Checkbox"
                    indeterminate
                    control={control}
                    count={12}
                    name="fourth"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Checkbox: Story = {
    render: () => <WrapperComponent />,
};

export const WithCount: Story = {
    render: () => <WrapperComponentWithCount />,
};
