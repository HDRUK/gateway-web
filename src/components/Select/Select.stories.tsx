import type { Meta, StoryObj } from "@storybook/react";
import SelectComponent from "@/components/Select";
import { useForm } from "react-hook-form";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Stack } from "@mui/material";
import Form from "@/components/Form";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BackupIcon from "@mui/icons-material/Backup";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
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
    sixth: string;
    seventh: string;
    eighth: string[];
};

const validationSchema = yup
    .object({
        first: yup.string().required().label("First"),
    })
    .required();

const DummyComponent = () => {
    const { handleSubmit, setValue, control } = useForm<FormData>({
        defaultValues: {
            first: "",
            second: "",
            third: "",
            fourth: "",
            fifth: "",
            sixth: "",
            seventh: "",
            eighth: [],
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = data => console.log(data);

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
                    setValue={setValue}
                />
                <SelectComponent
                    label="with different icons"
                    control={control}
                    options={optionsWithIcons}
                    name="fourth"
                    setValue={setValue}
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
                <Button type="submit">Submit</Button>
            </Stack>
        </Form>
    );
};

export const Select: Story = {
    render: () => <DummyComponent />,
};
