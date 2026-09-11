import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/nextjs";
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

const dois = Array.from(
    { length: 46 },
    (_, index) => `10.1000/journal.example.${index}`
);

const WrapperComponent = (
    props: Omit<
        AutocompleteProps<{ [key: string]: string }>,
        "control" | "name" | "label"
    > & { defaultValue?: string[] }
) => {
    const { defaultValue, ...rest } = props;
    const { control } = useForm<{ fieldName: string }>({
        defaultValues: { fieldName: defaultValue } as unknown as {
            fieldName: string;
        },
    });

    return (
        <Autocomplete
            control={control}
            label="Select an option"
            name="fieldName"
            {...rest}
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

export const ManyValues: Story = {
    args: {
        name: "publications",
        label: "Publication using the dataset",
        placeholder: "10.1001/jamapediatrics.2016.3633",
        freeSolo: true,
        multiple: true,
        canCreate: true,
    },
    render: props => <WrapperComponent {...props} defaultValue={dois} />,
};
