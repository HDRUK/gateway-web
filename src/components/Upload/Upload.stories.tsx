import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Upload from "./Upload";

const meta: Meta<typeof Upload> = {
    component: Upload,
    title: "Forms/Upload",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Upload>;

export type FormData = {
    upload: string;
};

const WrapperComponent = () => {
    const { handleSubmit, control, register } = useForm<FormData>({
        defaultValues: {
            upload: "",
        },
    });
    const onSubmit = (data: unknown) => console.log(data);
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={0} sx={{ padding: 0 }}>
                <Upload
                    {...register("upload")}
                    control={control}
                    label="Upload"
                    name="upload"
                    uploadSx={{ display: "none" }}
                    acceptFileTypes=".csv"
                    onFileChange={(file: File) => console.log(file)}
                    helperText={
                        "Must be a .csv file, cannot exceed 10 mb per file."
                    }
                />
                <Button type="submit" sx={{ maxWidth: 240 }}>
                    Submit
                </Button>
            </Stack>
        </Form>
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
