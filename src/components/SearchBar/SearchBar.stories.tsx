import { SubmitHandler, useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";
import SearchBar from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
    component: SearchBar,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export interface SearchForm {
    query: string;
}

const WrapperComponent = () => {
    const { control, handleSubmit, formState, reset } = useForm<SearchForm>({
        defaultValues: {
            query: "",
        },
    });

    const onSubmit: SubmitHandler<SearchForm> = data => {
        console.log(data);
    };

    return (
        <SearchBar
            control={control}
            explainerText={"Search by keywords, phenotypes, ICD10 codes"}
            resetAction={reset}
            resetDisabled={!formState.isDirty}
            submitAction={handleSubmit(onSubmit)}
            queryPlaceholder="Enter your search term"
            queryName="query"
        />
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
