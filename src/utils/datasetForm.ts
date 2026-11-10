import { get } from "lodash";
import {
    FormHydrationSchema,
    FormHydrationValidation,
} from "@/interfaces/FormHydration";
import { extractNamesFromDataType } from "@/utils/extractNamesFromDataTypes";

interface DatasetType {
    name: string;
    subTypes: string[];
}

interface DatasetDefaultFormValuesOptions {
    defaultTeamId: number;
    email?: string;
    today: string;
}

const getDatasetMetadataPath = (isDraft: boolean) =>
    isDraft
        ? "versions[0].metadata.original_metadata"
        : "versions[0].metadata.metadata";

const getDatasetTypeValues = (metadata: unknown) => {
    const datasetTypes: DatasetType[] =
        get(metadata, "provenance.origin.datasetType") ?? [];

    return {
        "Dataset type": extractNamesFromDataType(datasetTypes),
        "Dataset Type Array": datasetTypes.map(item => ({
            "Dataset type": item.name,
            "Dataset subtypes": item.subTypes,
        })),
    };
};

// here be dragons
// the validation rule around urls is strict.
// as it should be, the below question is not a user visible question, one the api populates behind the scenes..
// localhost:3000 is not a valid url so we fail validation silently locally so we can't create datasets..
// also if some past data contains a // like produrl//datasets/ it fails validation and the user can do nothing..
// as this value is defaulted behind the scenes and the user has no control over it, remove the validation from the frontend.
const withoutRevisionUrlValidation = (validation?: FormHydrationValidation[]) =>
    validation?.filter(obj => obj.title !== "revision url") || [];

const getDatasetDefaultFormValues = (
    defaultValues: FormHydrationSchema["defaultValues"],
    { defaultTeamId, email, today }: DatasetDefaultFormValuesOptions
): Record<string, unknown> => ({
    ...defaultValues,
    "Dataset identifier": "226fb3f1-4471-400a-8c39-2b66d46a39b6",
    "Dataset Version": "1.0.0",
    "revision version": "1.0.0",
    "revision url": "http://www.example.com/",
    identifier: defaultTeamId,
    "Metadata Issued Datetime": today,
    "Last Modified Datetime": today,
    "Name of Data Custodian": "--",
    "Dataset population size": -1,
    "Follow-up": null,
    "contact point": defaultValues.contact_point || email, // this is a hidden field and goes no where but it is summary.dataCustodian.contact_point
    "Contact point": email, // summary.contact_point
});

export {
    getDatasetDefaultFormValues,
    getDatasetMetadataPath,
    getDatasetTypeValues,
    withoutRevisionUrlValidation,
};
