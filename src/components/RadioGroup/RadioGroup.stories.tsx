import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/Button";
import Form from "@/components/Form";
import RadioGroup, { RadioGroupProps } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
    component: RadioGroup,
    title: "Forms/RadioGroup",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

const WrapperComponent = (props: RadioGroupProps) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            colour: "red",
        },
    });

    const onSubmit = (data: { [key: string]: string }) => {
        console.log("Submitted data: ", data);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack alignItems="start">
                <RadioGroup control={control} {...props} />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Default: Story = {
    args: {
        name: "colour",
        label: "Radio Options",
        radios: [
            { value: "red", label: "Red" },
            { value: "blue", label: "Blue" },
            { value: "yellow", label: "Yellow" },
        ],
    },
    render: props => <WrapperComponent {...props} />,
};
