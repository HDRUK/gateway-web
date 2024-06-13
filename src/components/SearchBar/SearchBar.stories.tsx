import type { Meta, StoryObj } from "@storybook/react";
import SearchBar from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
    component: SearchBar,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
    args: {
        explainerText: "Search by keywords, phenotypes, ICD10 codes",
        resetAction: () => console.log("reset"),
        submitAction: () => console.log("submit"),
        isDisabled: false,
        queryPlaceholder: "Enter your search term",
        queryName: "query",
    },
};
