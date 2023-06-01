import type { Meta, StoryObj } from "@storybook/react";
import Textfield from "@/components/Textfield";
import { useForm } from "react-hook-form";
import React from "react";
import AddAPhoto from "@mui/icons-material/AddAPhoto";
import { Stack } from "@mui/material";
import Form from "@/components/Form";
import Button from "../Button/Button";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/TextField",
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
    const { handleSubmit, setValue, control } = useForm<FormData>({
        defaultValues: {
            first: "",
            second: "",
            third: "",
            fourth: "",
            fifth: "",
        },
    });

    const onSubmit = data => console.log(data);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 240 }}>
                <Textfield
                    placeholder="Enter value here"
                    label="with placeholder"
                    control={control}
                    name="first"
                />
                <Textfield
                    label="is required"
                    rules={{ required: true }}
                    control={control}
                    name="second"
                />
                <Textfield
                    label="with info"
                    info="Info goes here"
                    control={control}
                    name="third"
                />
                <Textfield
                    label="with clear button"
                    control={control}
                    name="fourth"
                    setValue={setValue}
                />
                <Textfield
                    label="with icon"
                    icon={AddAPhoto}
                    control={control}
                    name="fifth"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const TextField: Story = {
    render: () => <DummyComponent />,
};
