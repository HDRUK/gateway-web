import { Collection } from "@/interfaces/Collection";
import { DataUse } from "@/interfaces/DataUse";
import { DataCustodianDataset } from "@/interfaces/Dataset";
import { Publication } from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";

interface TeamSummary {
    id: number;
    name: string;
    team_logo: string;
    is_provider: boolean;
    datasets: DataCustodianDataset[];
    durs: DataUse[];
    tools: Tool[];
    publications: Publication[];
    collections: Collection[];
}

export type { TeamSummary };
