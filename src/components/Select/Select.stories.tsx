import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import * as yup from "yup";
import Button from "@/components/Button";
import Form from "@/components/Form";
import LabelAndDescription from "@/components/LabelAndDescription";
import SelectComponent from "@/components/Select";
import {
    AccountCircleIcon,
    AdminPanelSettingsIcon,
    BackupIcon,
    SupervisorAccountIcon,
} from "@/consts/icons";

const meta: Meta<typeof Form> = {
    component: Form,
    title: "Forms/Select",
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
    seventh: string;
    eighth: string[];
    ninth: string[];
    tenth: string;
};

const validationSchema = yup
    .object({
        first: yup.string().required().label("First"),
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
            seventh: "",
            eighth: [],
            ninth: [],
            tenth: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: unknown) => console.log(data);

    const options = [
        { label: "Red", value: 1 },
        { label: "Green", value: 2 },
        { label: "Blue", value: 3 },
        { label: "Yellow", value: 4 },
    ];

    const optionsWithIcons = [
        { label: "Red", value: 1, icon: SupervisorAccountIcon },
        { label: "Green", value: 2, icon: SupervisorAccountIcon },
        { label: "Blue", value: 3, icon: AdminPanelSettingsIcon },
        { label: "Yellow", value: 4, icon: AdminPanelSettingsIcon },
    ];
    const optionsWithLabelComponent = [
        {
            labelComponent: (
                <LabelAndDescription
                    label="Red"
                    description="Strawberries are red"
                />
            ),
            label: "Red",
            value: 1,
        },
        {
            labelComponent: (
                <LabelAndDescription
                    label="Green"
                    description="Apples are green"
                />
            ),
            label: "Green",
            value: 2,
        },
        {
            labelComponent: (
                <LabelAndDescription
                    label="Blue"
                    description="Whales are blue"
                />
            ),
            label: "Blue",
            value: 3,
        },
        {
            labelComponent: (
                <LabelAndDescription
                    label="Yellow"
                    description="Bananas are yellow"
                />
            ),
            label: "Yellow",
            value: 4,
        },
    ];

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ marginBottom: 4, maxWidth: 240 }}>
                <SelectComponent
                    label="is required"
                    required
                    options={options}
                    control={control}
                    name="first"
                />
                <SelectComponent
                    label="with info"
                    info="Info goes here"
                    options={options}
                    control={control}
                    name="second"
                />
                <SelectComponent
                    label="with icon left"
                    control={control}
                    icon={AccountCircleIcon}
                    options={options}
                    name="third"
                />
                <SelectComponent
                    label="with different icons"
                    control={control}
                    options={optionsWithIcons}
                    name="fourth"
                />
                <SelectComponent
                    label="with icon right"
                    icon={BackupIcon}
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
                    name="sixth"
                />
                <SelectComponent
                    label="invert list item"
                    invertListItem
                    icon={AccountCircleIcon}
                    options={options}
                    control={control}
                    name="seventh"
                />
                <SelectComponent
                    label="multiple"
                    multiple
                    options={options}
                    control={control}
                    name="eighth"
                />
                <SelectComponent
                    label="multiple with checkbox"
                    multiple
                    hasCheckbox
                    options={options}
                    control={control}
                    name="ninth"
                />
                <SelectComponent
                    label="with label/description component"
                    options={optionsWithLabelComponent}
                    control={control}
                    name="tenth"
                />
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
