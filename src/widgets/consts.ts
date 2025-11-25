import { WidgetCategory } from "@/interfaces/Widget";

export const CATEGORIES: WidgetCategory[] = [
    "datasets",
    "data_uses",
    "scripts",
    "collections",
];

export const CATEGORY_LABEL: Record<WidgetCategory, string> = {
    datasets: "Datasets & Biosamples",
    data_uses: "Data Uses / Research Projects",
    scripts: "Analysis Scripts & Software",
    collections: "Collections",
};
