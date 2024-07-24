import { Collection } from "@/interfaces/Collection";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { Publication } from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";

interface TeamSummary {
    id: number;
    name: string;
    is_provider: boolean;
    datasets: Dataset[];
    durs: DataUse[];
    tools: Tool[];
    publications: Publication[];
    collections: Collection[];
}

export type { TeamSummary };
