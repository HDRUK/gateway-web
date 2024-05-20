export enum LegendStatus {
    VALID,
    OPTIONAL_REMAIN,
    INVALID,
    ACTIVE,
    UNTOUCHED,
}

export type LegendItem = {
    name: string;
    status: LegendStatus;
};
