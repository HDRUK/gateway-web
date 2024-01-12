import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/Button";
import Form from "@/components/Form";
import TextTime, { TextTimeProps } from "./TextTime";

const meta: Meta<typeof TextTime> = {
    component: TextTime,
    title: "Forms/TextTime",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TextTime>;

const WrapperComponent = (props: TextTimeProps) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            selectTime: "",
        },
    });

    const onSubmit = (data: { [key: string]: string }) => {
        console.log("Submitted data: ", data);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack alignItems="start">
                <TextTime control={control} {...props} />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Default: Story = {
    args: {
        name: "selectTime",
        label: "Select Time",
    },
    render: props => <WrapperComponent {...props} />,
};
