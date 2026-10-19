import { cloneDeep, get, set, uniq } from "lodash";
import { Schema, ValidationError } from "yup";
import { Dataset, Metadata } from "@/interfaces/Dataset";
import { FormHydrationSchema } from "@/interfaces/FormHydration";
import apis from "@/config/apis";
import { DataStatus } from "@/consts/application";
import { SCHEMA_NAME, SCHEMA_VERSION } from "@/consts/schema";
import {
    getDatasetDefaultFormValues,
    getDatasetMetadataPath,
    getDatasetTypeValues,
    withoutRevisionUrlValidation,
} from "@/utils/datasetForm";
import { getToday } from "@/utils/date";
import {
    getDatasetValidationSchema,
    mapExistingDatasetToFormFields,
} from "@/utils/formHydration";
import { decodeHtmlEntity } from "@/utils/general";

type FetchData = <T>(url: string) => Promise<T | null>;

interface ActivationTarget {
    schema: Schema;
    values: object;
}

interface LinkedItem {
    id: number;
    link_type?: string;
}

interface Collaborator {
    id: number;
    pivot: { role: string };
}

const getActivationErrors = async (
    schema: Schema,
    values: object,
    labels: Record<string, string> = {}
): Promise<string[]> => {
    try {
        await schema.validate(values, { abortEarly: false });
        return [];
    } catch (error) {
        if (!ValidationError.isError(error)) {
            throw error;
        }

        const errors = error.inner.length ? error.inner : [error];

        return uniq(
            errors.map(({ path = "", message }) =>
                labels[path] ? `${labels[path]}: ${message}` : message
            )
        );
    }
};

const getLinkedItems = (items?: LinkedItem[]) =>
    items?.map(({ id, link_type }) => ({ id, link_type })) || [];

const getCollectionActivationValues = (collection: object) => ({
    ...collection,
    keywords: get(collection, "keywords", []).map(
        (item: LinkedItem) => item.id
    ),
    collaborators: get(collection, "users", [])
        .filter((item: Collaborator) => item.pivot.role !== "CREATOR")
        .map((item: Collaborator) => item.id),
});

const getToolActivationValues = (tool: object) => ({
    ...tool,
    type_category: get(tool, "type_category", []).map(
        (item: LinkedItem) => item.id
    ),
    programming_language: get(tool, "programming_languages", []).map(
        (item: LinkedItem) => item.id
    ),
    dataset: getLinkedItems(get(tool, "datasets")),
});

const getPublicationActivationValues = (publication: object) => ({
    ...publication,
    datasets: getLinkedItems(get(publication, "datasets")),
});

const loadEntityActivation =
    (url: string, schema: Schema, getValues = (entity: object) => entity) =>
    async (fetchData: FetchData): Promise<ActivationTarget | null> => {
        const entity = await fetchData<object>(url);

        if (!entity) {
            return null;
        }

        return { schema, values: getValues(entity) };
    };

const loadDatasetActivation =
    (baseDatasetsUrl: string, dataset: Dataset, email?: string) =>
    async (fetchData: FetchData): Promise<ActivationTarget | null> => {
        const isDraft = dataset.status === DataStatus.DRAFT;

        const existingDataset = await fetchData<Dataset>(
            isDraft
                ? `${baseDatasetsUrl}/${dataset.id}`
                : `${baseDatasetsUrl}/${dataset.id}?schema_model=${SCHEMA_NAME}&schema_version=${SCHEMA_VERSION}`
        );

        if (!existingDataset) {
            return null;
        }

        const metadata = cloneDeep(
            get(existingDataset, getDatasetMetadataPath(isDraft))
        ) as Metadata;
        const keywords: string[] | undefined = get(
            metadata,
            "summary.keywords"
        );

        if (keywords) {
            set(
                metadata,
                "summary.keywords",
                keywords.map(keyword => decodeHtmlEntity(keyword))
            );
        }

        const datasetTypeValues = getDatasetTypeValues(metadata);
        const dataCustodianIdentifier = get(
            metadata,
            "summary.dataCustodian.identifier"
        );
        const dataCustodianId = Number.isNaN(Number(dataCustodianIdentifier))
            ? await fetchData<string>(
                  `${apis.teamsV1Url}/${dataCustodianIdentifier || ""}/id`
              )
            : dataCustodianIdentifier;

        const formJSON = await fetchData<FormHydrationSchema>(
            `${apis.formHydrationV1Url}?name=${SCHEMA_NAME}&version=${SCHEMA_VERSION}&dataTypes=${
                datasetTypeValues["Dataset type"]
            }${dataCustodianId ? `&team_id=${dataCustodianId}` : ""}`
        );

        if (!formJSON) {
            return null;
        }

        return {
            schema: getDatasetValidationSchema(
                withoutRevisionUrlValidation(formJSON.validation)
            ),
            values: {
                ...getDatasetDefaultFormValues(formJSON.defaultValues, {
                    defaultTeamId: Number(dataCustodianId),
                    email,
                    today: getToday(),
                }),
                ...mapExistingDatasetToFormFields(
                    formJSON.schema_fields,
                    metadata
                ),
                ...datasetTypeValues,
            },
        };
    };

export type { ActivationTarget, FetchData };

export {
    getActivationErrors,
    getCollectionActivationValues,
    getPublicationActivationValues,
    getToolActivationValues,
    loadDatasetActivation,
    loadEntityActivation,
};
