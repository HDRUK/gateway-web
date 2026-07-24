import type { Meta, StoryObj } from "@storybook/nextjs";
import { Unit, WidgetEntityData } from "@/interfaces/Widget";
import WidgetDisplay from "./WidgetDisplay";

const meta: Meta<typeof WidgetDisplay> = {
    component: WidgetDisplay,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof WidgetDisplay>;

const data: WidgetEntityData = {
    datasets: [
        {
            id: 1,
            team_id: 1,
            dataset_version_id: 1,
            title: "National Synthetic Respiratory Dataset",
            short_title: "Synthetic Respiratory Data",
            description: "A synthetic dataset covering respiratory admissions.",
            population_size: 250000,
            start_date: "2015-01-01",
            end_date: "2023-12-31",
            publisher: "Example Data Custodian",
        },
        {
            id: 2,
            team_id: 1,
            dataset_version_id: 2,
            title: "Synthetic Cardiovascular Outcomes Dataset",
            short_title: "Synthetic Cardio Outcomes",
            publisher: "Example Data Custodian",
        },
    ],
    data_uses: [
        {
            id: 3,
            name: "Synthetic data use for research demonstration",
            organisation_name: "Example University",
        },
    ],
    scripts: [
        {
            id: 4,
            team_id: 1,
            name: "Cohort curation script",
            description: "Example analysis script.",
        },
    ],
    collections: [
        {
            id: 5,
            team_id: 1,
            name: "Respiratory Collection",
        },
    ],
    widget: {
        widget_name: "Storybook widget",
        size_width: 400,
        size_height: 592,
        unit: Unit.PX,
        include_search_bar: 1,
        include_cohort_link: 1,
        keep_proportions: 0,
    },
};

export const Default: Story = {
    args: {
        data,
    },
};

export const Minimal: Story = {
    args: {
        data: {
            ...data,
            data_uses: [],
            scripts: [],
            collections: [],
            widget: {
                ...data.widget,
                include_search_bar: 0,
                include_cohort_link: 0,
            },
        },
    },
};

export const CustomBranding: Story = {
    args: {
        data: {
            ...data,
            widget: {
                ...data.widget,
                branding_primary: "#005EB8",
                branding_secondary: "#007F3B",
                branding_neutral: "#F0F4F5",
            },
        },
    },
};
