import { Collection } from "@/interfaces/Collection";
import { DataProvider as DataCustodian } from "@/interfaces/DataProvider";
import { DataUse } from "@/interfaces/DataUse";
import { DataCustodianDataset } from "@/interfaces/Dataset";
import { Publication } from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";

interface NetworkSummary {
    id: number;
    name: string;
    is_provider: boolean;
    datasets: DataCustodianDataset[];
    durs: DataUse[];
    tools: Tool[];
    publications: Publication[];
    collections: Collection[];
    teams_counts: DataCustodian[];
    img_url?: string;
}

export type { NetworkSummary };
