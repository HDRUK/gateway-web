import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import * as yup from "yup";
import Button from "@/components/Button";
import Form from "@/components/Form";
import TextAreaComponent from "@/components/TextArea";

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
    const { handleSubmit, control } = useForm<FormData>({
        defaultValues: {
            first: "",
            second: "",
            third: "",
            fourth: "",
            fifth: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: unknown) => console.log(data);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 240 }}>
                <TextAreaComponent
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
