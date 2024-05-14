import type { Meta, StoryObj } from "@storybook/react";
import FormBanner from "./FormBanner";

const meta: Meta<typeof FormBanner> = {
    component: FormBanner,
    title: "Forms/FormBanner",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FormBanner>;

const TAB_LIST = [
    { label: "Online Form", value: "FORM" },
    { label: "Upload File", value: "UPLOAD" },
].map(tabItem => ({
    label: `${tabItem.label} `,
    value: tabItem.value,
    content: null,
}));

export const Default: Story = {
    args: {
        tabItems: TAB_LIST,
        downloadAction: () => console.log("DOWNLOAD"),
        makeActiveAction: () => console.log("MAKE ACTIVE"),
        saveAsDraftAction: () => console.log("SAVE DRAFT"),
        completionPercentage: 20,
        optionalPercentage: 0,
    },
};
