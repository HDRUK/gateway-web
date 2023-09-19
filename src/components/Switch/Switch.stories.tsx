import type { Meta, StoryObj } from "@storybook/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import Button from "@/components/Button";
import Switch from "./Switch";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/Switch",
};

export default meta;

type Story = StoryObj<typeof Form>;

export type FormData = {
    first: string;
    second: boolean;
};

const validationSchema = yup
    .object({
        second: yup.boolean().required().oneOf([true]),
    })
    .required();

const switchLabels = {
    checkedLabel: "On",
    unCheckedLabel: "Off",
};

const DummyComp = () => {
    const { handleSubmit, control } = useForm<FormData>({
        defaultValues: {
            first: "",
            second: false,
        },
        resolver: yupResolver(validationSchema),
    });
    const onSubmit = (data: unknown) => console.log(data);
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 240 }}>
                <Switch {...switchLabels} control={control} name="first" />
                <Switch {...switchLabels} control={control} name="second" />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const SwitchComponent: Story = {
    render: () => <DummyComp />,
};
