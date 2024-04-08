import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Meta, StoryObj } from "@storybook/react";
import * as yup from "yup";
import { inputComponents } from "@/config/forms";
import MultiInputWrapper from "./MultiInputWrapper";

const meta: Meta<typeof MultiInputWrapper> = {
    component: MultiInputWrapper,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MultiInputWrapper>;

export type FormData = {
    first: string;
    second: string;
    third: string[];
    forth: boolean;
};

const WrapperComponent = () => {
    const validationSchema = yup
        .object({
            second: yup.string().email().required(),
            forth: yup.boolean().required(),
        })
        .required();

    const { control } = useForm<FormData>({
        defaultValues: {
            first: "First text in form",
            second: "test@test.com",
            third: ["test"],
            forth: true,
        },
        resolver: yupResolver(validationSchema),
    });

    const formFields = [
        {
            name: "first",
            label: "First in Form",
            component: inputComponents.TextField,
        },
        {
            name: "second",
            label: "Second in Form",
            component: inputComponents.TextField,
        },
        {
            name: "third",
            label: "Third in Form",
            component: inputComponents.Autocomplete,
        },
        {
            name: "forth",
            label: "Forth in Form",
            component: inputComponents.CheckboxRow,
        },
    ];

    return <MultiInputWrapper control={control} fields={formFields} />;
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
