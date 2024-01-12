import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import * as yup from "yup";
import Button from "@/components/Button";
import Form from "@/components/Form";
import TextFieldComponent from "@/components/TextField";
import { AddAPhotoIcon } from "@/consts/icons";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/TextField",
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
    sixth: string;
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
            sixth: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = data => console.log(data);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 240 }}>
                <TextFieldComponent
                    placeholder="Enter value here"
                    label="with placeholder"
                    control={control}
                    name="first"
                />
                <TextFieldComponent
                    label="is required"
                    required
                    control={control}
                    name="second"
                />
                <TextFieldComponent
                    label="with info"
                    info="Info goes here"
                    control={control}
                    name="third"
                />
                <TextFieldComponent
                    label="with clear button"
                    control={control}
                    name="fourth"
                    showClearButton
                />
                <TextFieldComponent
                    label="with icon"
                    icon={AddAPhotoIcon}
                    control={control}
                    name="fifth"
                />
                <TextFieldComponent
                    label="disabled"
                    disabled
                    control={control}
                    name="sixth"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
