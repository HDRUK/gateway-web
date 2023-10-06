import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
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
    { id: "red", label: "Red" },
    { id: "blue", label: "Blue" },
    { id: "yellow", label: "Yellow" },
];

const WrapperComponent = (props: Omit<AutocompleteProps, "control">) => {
    const { control } = useForm();

    return <Autocomplete control={control} {...props} />;
};

export const Default: Story = {
    args: {
        label: "Select an option",
        name: "colors",
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
