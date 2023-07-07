import type { Meta, StoryObj } from "@storybook/react";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import Upload from "./Upload";
import Button from "../Button/Button";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/Upload",
};

export default meta;

type Story = StoryObj<typeof Form>;

export type FormData = {
    upload: string;
};

const DummyComp = () => {
    const { handleSubmit, control, register } = useForm<FormData>({
        defaultValues: {
            upload: "",
        },
    });
    const onSubmit = (data: unknown) => console.log(data);
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 20, maxWidth: 240 }}>
                <Upload
                    inputRef={register}
                    control={control}
                    label="Upload"
                    name="upload"
                    uploadSx={{ display: "none" }}
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const UploadComponent: Story = {
    render: () => <DummyComp />,
};
