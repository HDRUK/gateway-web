import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";
import CheckboxGroup from "./CheckboxGroup";

const meta: Meta<typeof CheckboxGroup> = {
    component: CheckboxGroup,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

interface WrapperComponentProps {
    checkboxes: { value: string; label: string }[];
}

const WrapperComponent = ({ checkboxes, ...rest }: WrapperComponentProps) => {
    const { control } = useForm();
    return (
        <CheckboxGroup
            control={control}
            direction="row"
            label="Which?"
            name="test"
            spacing={2}
            checkboxes={checkboxes}
            {...rest}
        />
    );
};

export const Default: Story = {
    args: {
        checkboxes: [
            {
                label: "Test 1",
                value: "test1",
            },
            {
                label: "Test 2",
                value: "test2",
            },
        ],
    },
    render: props => <WrapperComponent {...props} />,
};

export const Spacing: Story = {
    args: {
        nColumns: 4,
        checkboxes: [
            {
                label: "Test 123456",
                value: "test1",
            },
            {
                label: "Test ABCD",
                value: "test2",
            },
            {
                label: "Test XYZ12341234",
                value: "test3",
            },
            {
                label: "Test .",
                value: "test4",
            },
            {
                label: "Test ...",
                value: "test5",
            },
            {
                label: "Test .........",
                value: "test6",
            },
        ],
    },
    render: props => <WrapperComponent {...props} />,
};

export const Many: Story = {
    args: {
        nColumns: 3,
        formControlSx: { backgroundColor: "orange", mb: 0 },
        checkboxes: Array.from({ length: 10 }, (_, index) => ({
            label: `Test Long Label ${index + 1}`,
            value: `test${index + 1}`,
        })),
    },
    render: props => <WrapperComponent {...props} />,
};

export const Horizontal: Story = {
    args: {
        horizontalForm: true,
        checkboxes: Array.from({ length: 5 }, (_, index) => ({
            label: `Test Long Label ${index + 1}`,
            value: `test${index + 1}`,
        })),
    },
    render: props => <WrapperComponent {...props} />,
};
