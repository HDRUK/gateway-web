import type { Meta, StoryObj } from "@storybook/react";
import TextAreaComponent from "@/components/TextArea";
import { useForm } from "react-hook-form";
import React from "react";
import { Stack } from "@mui/material";
import Form from "@/components/Form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/Button";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/TextArea",
    tags: ["autodocs"],
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

const validationSchema = yup
    .object({
        second: yup.string().required().label("Second"),
    })
    .required();

const WrapperComponent = () => {
    const { handleSubmit, getValues, control } = useForm<FormData>({
        defaultValues: {
            first: "",
            second: "",
            third: "",
            fourth: "",
            fifth: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = data => console.log(data);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 240 }}>
                <TextAreaComponent
                    getValues={getValues}
                    limit={150}
                    label="with character limit"
                    control={control}
                    name="first"
                />
                <TextAreaComponent
                    label="is required"
                    required
                    control={control}
                    name="second"
                />
                <TextAreaComponent
                    label="with info"
                    info="Info goes here"
                    control={control}
                    name="third"
                />
                <TextAreaComponent
                    label="disabled"
                    disabled
                    control={control}
                    name="fourth"
                />
                <TextAreaComponent
                    label="custom rows"
                    rows={2}
                    control={control}
                    name="fifth"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const TextArea: Story = {
    render: () => <WrapperComponent />,
};
