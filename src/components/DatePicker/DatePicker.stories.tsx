import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/Button";
import Form from "@/components/Form";
import DatePicker, { DatePickerProps } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
    component: DatePicker,
    title: "Forms/DatePicker",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

const WrapperComponent = (props: DatePickerProps) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            colour: "2020-01-01",
        },
    });

    const onSubmit = (data: { [key: string]: string }) => {
        console.log("Submitted data: ", data);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack alignItems="start">
                <DatePicker control={control} {...props} />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Default: Story = {
    args: {
        name: "Date",
        label: "Dates",
    },
    render: props => <WrapperComponent {...props} />,
};
