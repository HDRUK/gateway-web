import { IconType } from "./Ui";

export enum LegendStatus {
    VALID,
    OPTIONAL_REMAIN,
    INVALID,
    ACTIVE,
    UNTOUCHED,
}

export type LegendItem = {
    name: string;
    count?: string;
    status: LegendStatus;
    subItems?: LegendItem[];
    id?: number;
    icon?: IconType;
};
