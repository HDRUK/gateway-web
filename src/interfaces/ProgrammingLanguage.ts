import { Dayjs } from "dayjs";

export interface ProgrammingLanguage {
    id: number;
    created_at: Date | Dayjs | string;
    updated_at: Date | Dayjs | string;
    enabled: boolean;
    name: string;
}
