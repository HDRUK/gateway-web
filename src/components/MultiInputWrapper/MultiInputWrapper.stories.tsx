import type { Meta, StoryObj } from "@storybook/react";
import MultiInputWrapper from "./MultiInputWrapper";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

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
        { name: "first", label: "First in Form", component: "TextField" },
        { name: "second", label: "Second in Form", component: "TextField" },
        { name: "third", label: "Third in Form", component: "Autocomplete" },
        { name: "forth", label: "Forth in Form", component: "CheckboxRow" },
    ];

    const onSubmit = (data: unknown) => console.log(data);
    const onCancel = () => {};

    return (
        <>
            <MultiInputWrapper control={control} fields={formFields} />
        </>
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
