import type { Meta, StoryObj } from "@storybook/react";
import SelectComponent from "@/components/Select";
import { useForm } from "react-hook-form";
import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import { Stack } from "@mui/material";
import Form from "@/components/Form";
import Button from "../Button/Button";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/Select",
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

    const options = [
        { label: "one", value: 1 },
        { label: "two", value: 2 },
        { label: "three", value: 3 },
        { label: "four", value: 4 },
    ];

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 240 }}>
                <SelectComponent
                    label="is required"
                    rules={{ required: true }}
                    options={options}
                    control={control}
                    name="second"
                />
                <SelectComponent
                    label="with info"
                    info="Info goes here"
                    options={options}
                    control={control}
                    name="third"
                />
                <SelectComponent
                    label="with icon left"
                    control={control}
                    icon={DoneIcon}
                    options={options}
                    name="fourth"
                    setValue={setValue}
                />
                <SelectComponent
                    label="with icon right"
                    icon={DoneIcon}
                    iconRight
                    options={options}
                    control={control}
                    name="fifth"
                />
                <SelectComponent
                    label="disabled"
                    disabled
                    options={options}
                    control={control}
                    name="fifth"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Select: Story = {
    render: () => <DummyComponent />,
};
