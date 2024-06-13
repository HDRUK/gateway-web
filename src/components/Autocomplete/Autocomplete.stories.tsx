import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchIcon } from "@/consts/icons";
import Autocomplete, { AutocompleteProps } from "./Autocomplete";

const meta: Meta<typeof Autocomplete> = {
    component: Autocomplete,
    title: "Forms/Autocomplete",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

const colors = [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "yellow", label: "Yellow" },
];

const WrapperComponent = (
    props: Omit<
        AutocompleteProps<{ [key: string]: string }>,
        "control" | "name" | "label"
    >
) => {
    const { control } = useForm<{ fieldName: string }>();

    return (
        <Autocomplete
            control={control}
            label="Select an option"
            name="fieldName"
            {...props}
        />
    );
};

export const Default: Story = {
    args: {
        options: colors,
    },
    render: props => <WrapperComponent {...props} />,
};

export const CreateChips: Story = {
    args: {
        name: "keywords",
        placeholder: "Add a keyword",
        createLabel: "Add keyword ",
        selectOnFocus: true,
        clearOnBlur: true,
        handleHomeEndKeys: true,
        freeSolo: true,
        multiple: true,
        startAdornmentIcon: <SearchIcon color="primary" />,
        canCreate: true,
    },
    render: props => <WrapperComponent {...props} />,
};
