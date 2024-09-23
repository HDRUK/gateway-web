import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";
import Wysiwyg from "./Wysiwyg";

const meta: Meta<typeof Wysiwyg> = {
    component: Wysiwyg,
    title: "Forms/Wysiwyg",
    tags: ["autodocs"],
} satisfies Meta<typeof Wysiwyg>;

export default meta;

type Story = StoryObj<typeof meta>;

const WrapperComponent = () => {
    const { control } = useForm<{
        introduction: string | null;
    }>({
        defaultValues: {
            introduction: null,
        },
    });

    return (
        <Wysiwyg label="Introduction" name="introduction" control={control} />
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
