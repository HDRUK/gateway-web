import { Alias } from "@/interfaces/Alias";
import {
    NetworkCollection,
    NetworkDataset,
    NetworkDur,
    NetworkPublication,
    NetworkTool,
} from "@/interfaces/DataCustodianNetwork";
import { DataCustodianDataset } from "@/interfaces/Dataset";

interface TeamSummary {
    id: number;
    name: string;
    member_of: string;
    team_logo: string;
    is_provider: boolean;
    introduction: string | null;
    datasets: DataCustodianDataset[];
    durs: NetworkDur[];
    tools: NetworkTool[];
    publications: NetworkPublication[];
    collections: NetworkCollection[];
    associated_datasets: NetworkDataset[];
    associated_durs: NetworkDur[];
    associated_tools: NetworkTool[];
    associated_publications: NetworkPublication[];
    associated_collections: NetworkCollection[];
    url: string | null;
    service: string[] | null;
    aliases?: Alias[];
}

export type { TeamSummary };
