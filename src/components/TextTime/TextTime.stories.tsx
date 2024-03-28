import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/Button";
import Form from "@/components/Form";
import TextTime from "./TextTime";

const meta: Meta<typeof TextTime> = {
    component: TextTime,
    title: "Forms/TextTime",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TextTime>;

const WrapperComponent = () => {
    const { control, handleSubmit } = useForm<{
        selectedHour: string;
        selectedMinute: string;
    }>({
        defaultValues: {
            selectedHour: "",
            selectedMinute: "",
        },
    });

    const onSubmit = (data: { [key: string]: string }) => {
        console.log("Submitted data: ", data);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack alignItems="start">
                <TextTime
                    control={control}
                    name={{ hour: "selectedHour", minute: "selectedMinute" }}
                    label="Select Time"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
