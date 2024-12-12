import { DataUse } from "./DataUse";
import { ReducedDataset } from "./Dataset";
import { Publication } from "./Publication";
import { Tool } from "./Tool";

export type ResourceDataType = ReducedDataset | DataUse | Publication | Tool;

export enum ResourceType {
    DATASET = "dataset",
    DATA_USE = "datause",
    PUBLICATION = "publication",
    TOOL = "tool",
}

export interface SelectedResources {
    [ResourceType.DATASET]?: ReducedDataset[];
    [ResourceType.DATA_USE]?: DataUse[];
    [ResourceType.PUBLICATION]?: Publication[];
    [ResourceType.TOOL]?: Tool[];
}
