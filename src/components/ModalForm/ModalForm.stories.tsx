import type { Meta, StoryObj } from "@storybook/react";
import ModalForm from "./ModalForm";
import { useForm } from "react-hook-form";
import Box from "@/components/Box";
import { EditIcon } from "@/consts/icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const meta: Meta<typeof ModalForm> = {
    component: ModalForm,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ModalForm>;

export type FormData = {
    first: string;
    second: string;
};

const WrapperComponent = () => {
    const validationSchema = yup
        .object({
            second: yup.string().email().required(),
        })
        .required();

    const { control } = useForm<FormData>({
        defaultValues: {
            first: "First text in form",
            second: "test@test.com",
        },
        resolver: yupResolver(validationSchema),
    });

    const formFields = [
        { name: "first", label: "First in Form", component: "TextField" },
        { name: "second", label: "Second in Form", component: "TextField" },
    ];

    const onSubmit = (data: unknown) => console.log(data);
    const onCancel = () => {};

    return (
        <ModalForm
            control={control}
            formFields={formFields}
            onSuccess={onSubmit}
            onCancel={onCancel}
            confirmText={"Submit Form"}
            cancelText={"Cancel"}
            title={"Email Modal Form"}
            content={
                <Box
                    sx={{ p: 0 }}
                    display="flex"
                    alignItems="center"
                    aria-label="download-cohort-table">
                    <EditIcon color="primary" />
                </Box>
            }
        />
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
