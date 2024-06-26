import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Application } from "@/interfaces/Application";
import { AuthUser } from "@/interfaces/AuthUser";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { Collection } from "@/interfaces/Collection";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { Filter } from "@/interfaces/Filter";
import { FormHydrationSchema } from "@/interfaces/FormHydration";
import { Team } from "@/interfaces/Team";
import { Tool } from "@/interfaces/Tool";
import apis from "@/config/apis";
import config from "@/config/config";
import { FILTERS_PER_PAGE } from "@/config/request";
import { getUserFromToken } from "@/utils/cookies";

async function get<T>(
    cookieStore: ReadonlyRequestCookies,
    url: string
): Promise<T> {
    const jwt = cookieStore.get(config.JWT_COOKIE);

    const res = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${jwt?.value}` },
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    const { data } = await res.json();

    return data;
}

async function getFilters(
    cookieStore: ReadonlyRequestCookies
): Promise<Filter[]> {
    return get<Filter[]>(
        cookieStore,
        `${apis.filtersV1UrlIP}?perPage=${FILTERS_PER_PAGE}`
    );
}

async function getUser(cookieStore: ReadonlyRequestCookies): Promise<AuthUser> {
    const jwt = cookieStore.get(config.JWT_COOKIE);
    const authUser = getUserFromToken(jwt?.value);
    return get<AuthUser>(cookieStore, `${apis.usersV1UrlIP}/${authUser?.id}`);
}

async function getApplication(
    cookieStore: ReadonlyRequestCookies,
    applicationId: string
): Promise<Application> {
    return get<Application>(
        cookieStore,
        `${apis.applicationsV1UrlIP}/${applicationId}`
    );
}

async function getCohort(
    cookieStore: ReadonlyRequestCookies,
    cohortId: string
): Promise<CohortRequest> {
    return get<CohortRequest>(
        cookieStore,
        `${apis.cohortRequestsV1UrlIP}/${cohortId}`
    );
}

async function getTeam(
    cookieStore: ReadonlyRequestCookies,
    teamId: string
): Promise<Team> {
    const team = await get<Team>(cookieStore, `${apis.teamsV1UrlIP}/${teamId}`);

    return {
        ...team,
        users: team?.users.map(user => ({
            ...user,
            roles: user.roles.filter(
                // Remove global "hdruk" roles from team users
                role => !role.name.startsWith("hdruk")
            ),
        })),
    };
}

async function getDataset(
    cookieStore: ReadonlyRequestCookies,
    datasetId: string
): Promise<Dataset> {
    return Promise.resolve({
        versions: [
            {
                id: 1102,
                created_at: "2024-06-18T10:03:23.000000Z",
                updated_at: "2024-06-18T10:03:23.000000Z",
                deleted_at: null,
                dataset_id: 1081,
                metadata: {
                    metadata: {
                        required: {
                            gatewayId: "1081",
                            gatewayPid: "92902529-204b-4eae-a986-af561840d912",
                            issued: "2024-06-18T10:03:23.260801Z",
                            modified: "2024-06-18T10:03:23.260804Z",
                            revisions: [],
                            version: "1.0.0",
                        },
                        summary: {
                            abstract:
                                "This collection specifically relates to a short pain survey",
                            contactPoint: "t.g.hales@dundee.ac.uk",
                            keywords: "Alleviate;,;Pain;,;Pain Hub",
                            controlledKeywords: null,
                            datasetType: "Healthdata",
                            description:
                                "The 1958 National Child Development Study (NCDS) is.",
                            doiName: "10.5255/UKDA-SN-8731-1",
                            shortTitle:
                                "1958 National Child Development Study - Pain data",
                            title: "1958 National Child Development Study - Pain data",
                            publisher: {
                                gatewayId:
                                    "d519a167-87c2-4e01-b1f2-19f4b9bf48d1",
                                name: "ALLEVIATE",
                            },
                            populationSize: -1,
                            datasetSubType: null,
                        },
                        coverage: {
                            pathway:
                                "Data are not associated with a patient pathway.",
                            spatial:
                                "https://www.geonames.org/2648147/great-britain.html",
                            followup: "> 10 YEARS",
                            typicalAgeRange: "31-59",
                            biologicalsamples: null,
                            gender: null,
                            psychological: null,
                            physical: null,
                            anthropometric: null,
                            lifestyle: null,
                            socioeconomic: null,
                        },
                        provenance: {
                            origin: {
                                purpose: "STUDY",
                                source: "PAPER BASED",
                                collectionSituation: "COMMUNITY;,;HOME",
                            },
                            temporal: {
                                endDate: "2004-03-31",
                                startDate: "2002-09-01",
                                timeLag: "1-2 MONTHS",
                                accrualPeriodicity: "STATIC",
                                distributionReleaseDate: "2004-03-31",
                            },
                        },
                        accessibility: {
                            access: {
                                deliveryLeadTime: null,
                                jurisdiction: "GB-GB",
                                dataController:
                                    "University College London is the Data Controller and is committed to protecting the rights of individuals in line with the Data Protection",
                                dataProcessor:
                                    "George Ploubidis. Professor of Population Health and Statistics at the UCL Social Research Institute.",
                                accessRights:
                                    "https://beta.ukdataservice.ac.uk",
                                accessService:
                                    "The Data Collection is available to",
                                accessRequestCost:
                                    "https://beta.ukdataservice.ac.uk",
                                accessServiceCategory: null,
                            },
                            usage: {
                                dataUseLimitation: "GENERAL RESEARCH USE",
                                dataUseRequirement:
                                    "PROJECT SPECIFIC RESTRICTIONS",
                                resourceCreator: {
                                    name: "UK Data Services",
                                    gatewayId: null,
                                    rorId: null,
                                },
                            },
                            formatAndStandards: {
                                vocabularyEncodingSchemes:
                                    "NHS NATIONAL CODES;,;OTHER;,;LOCAL",
                                conformsTo: "NHS DATA DICTIONARY",
                                languages: "en",
                                formats: "Text",
                            },
                        },
                        linkage: {
                            associatedMedia: "",
                            isReferenceIn: "",
                            tools: null,
                            datasetLinkage: {
                                isDerivedFrom: "Not Known",
                                isPartOf: "",
                                linkedDatasets: "",
                                isMemberOf: null,
                            },
                            investigations: "",
                            isGeneratedUsing: null,
                            dataUses: null,
                            syntheticDataWebLink: null,
                        },
                        observations: [
                            {
                                observedNode: "FINDINGS",
                                measuredValue: 8565,
                                observationDate: "2002-09-01",
                                measuredProperty: "Count",
                                disambiguatingDescription:
                                    "Self-reported pain questionnaire",
                            },
                        ],
                        structuralMetadata: [
                            {
                                name: "NCDS Biomedical Paper Self-Completion 1 (2002) Dataset (85 of 172)",
                                description: null,
                                columns: [
                                    {
                                        name: "BE1",
                                        description:
                                            "SC1 (E1): Pain during the last month lasting > one day",
                                        dataType: "Frequency",
                                        sensitive: false,
                                        values: [
                                            {
                                                name: "Male",
                                                frequency: 50,
                                                description: null,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                        tissuesSampleCollection: null,
                    },
                    original_metadata: {
                        identifier: "",
                        version: "1.0.0",
                        issued: "2021-09-23T00:00:00.000Z",
                        modified: "2021-09-23T00:00:00.000Z",
                        revisions: [],
                        summary: {
                            title: "1958 National Child Development Study - Pain data",
                            abstract:
                                "This collection specifically relates to a short pain survey (self-completion booklet) completed by NCDS participants in 2002-3.",
                            publisher: {
                                identifier: "",
                                name: "ALLEVIATE",
                                logo: null,
                                description: null,
                                contactPoint: null,
                                memberOf: "HUB",
                            },
                            contactPoint: "t.g.hales@dundee.ac.uk",
                            keywords: "Alleviate;,;Pain;,;Pain Hub",
                            alternateIdentifiers: null,
                            doiName: "10.5255/UKDA-SN-8731-1",
                        },
                        documentation: {
                            description:
                                "The 1958 National Child Development Stud",
                            associatedMedia: "",
                            isPartOf: "",
                        },
                        coverage: {
                            spatial: "",
                            typicalAgeRange: "31-59",
                            physicalSampleAvailability: null,
                            followup: "> 10 YEARS",
                            pathway:
                                "Data are not associated with a patient pathway.",
                        },
                        provenance: {
                            origin: {
                                purpose: "STUDY",
                                source: "PAPER BASED",
                                collectionSituation: "COMMUNITY;,;HOME",
                            },
                            temporal: {
                                accrualPeriodicity: "STATIC",
                                distributionReleaseDate: "2004-03-31",
                                startDate: "2002-09-01",
                                endDate: "2004-03-31",
                                timeLag: "1-2 MONTHS",
                            },
                        },
                        accessibility: {
                            usage: {
                                dataUseLimitation: "GENERAL RESEARCH USE",
                                dataUseRequirements:
                                    "PROJECT SPECIFIC RESTRICTIONS",
                                resourceCreator: "UK Data Services",
                                investigations: "",
                                isReferencedBy: "",
                            },
                            access: {
                                accessRights: "",
                                accessService:
                                    "The Data Collection is available to users registered with the UK Data Service.\n\nCommercial use of the data requires approval from the data owner or their nominee. The UK Data Service will contact you.",
                                accessRequestCost: "",
                                deliveryLeadTime: null,
                                jurisdiction: "GB-GB",
                                dataProcessor:
                                    "George Ploubidis. Professor of Population Health and Statistics at the UCL Social Research Institute.",
                                dataController:
                                    "University College London is the Data Controller and is committed to protecting the rights of individuals in line with",
                            },
                            formatAndStandards: {
                                vocabularyEncodingScheme:
                                    "NHS NATIONAL CODES;,;OTHER;,;LOCAL",
                                conformsTo: "NHS DATA DICTIONARY",
                                language: "en",
                                format: "Text",
                            },
                        },
                        enrichmentAndLinkage: {
                            qualifiedRelation: "",
                            derivation: "Not Known",
                            tools: null,
                        },
                        observations: [
                            {
                                observedNode: "FINDINGS",
                                measuredValue: 8565,
                                measuredProperty: "Count",
                                observationDate: "2002-09-01",
                                disambiguatingDescription:
                                    "Self-reported pain questionnaire",
                            },
                        ],
                        structuralMetadata: [
                            {
                                name: "NCDS Biomedical Paper Self-Completion 1 (2002) Dataset (85 of 172)",
                                description: null,
                                elements: [
                                    {
                                        name: "BE1",
                                        description:
                                            "SC1 (E1): Pain during the last month lasting > one day",
                                        dataType: "Frequency",
                                        sensitive: false,
                                    },
                                ],
                            },
                            {
                                name: "NCDS Biomedical Paper Self-Completion 1 (2002) Dataset (85 of 172)",
                                description: null,
                                elements: [
                                    {
                                        name: "BE2",
                                        description:
                                            "SC1 (E2): Have you been aware of this pain for > 3 months",
                                        dataType: "Frequency",
                                        sensitive: false,
                                    },
                                ],
                            },
                            {
                                name: "NCDS Biomedical Paper Self-Completion 1 (2002) Dataset (85 of 172)",
                                description: null,
                                elements: [
                                    {
                                        name: "E3_ACR1",
                                        description:
                                            "SC1 (E3): ACRU Pain Definition - Left Upper",
                                        dataType: "Frequency",
                                        sensitive: false,
                                    },
                                ],
                            },
                        ],
                    },
                    gwdmVersion: "1.2",
                },
                version: 1,
                provider_team_id: null,
                application_type: null,
            },
        ],
    });
    // return await get<Dataset>(
    //     cookieStore,
    //     `${apis.datasetsV1UrlIP}/${datasetId}`
    // );
}

async function getDataUse(
    cookieStore: ReadonlyRequestCookies,
    dataUseId: string
): Promise<DataUse> {
    const dataUse = await get<DataUse[]>(
        cookieStore,
        `${apis.dataUseV1UrlIP}/${dataUseId}`
    );

    return dataUse?.[0];
}

async function getTool(
    cookieStore: ReadonlyRequestCookies,
    toolId: string
): Promise<Tool> {
    const tool = await get<Tool>(cookieStore, `${apis.toolsV1UrlIP}/${toolId}`);

    return tool;
}

async function getCollection(
    cookieStore: ReadonlyRequestCookies,
    collectionId: string
): Promise<Collection> {
    const collection = await get<Collection>(
        cookieStore,
        `${apis.collectionsV1UrlIP}/${collectionId}`
    );

    return collection;
}

async function getFormHydration(
    cookieStore: ReadonlyRequestCookies,
    schemaName: string,
    schemaVersion: string
): Promise<FormHydrationSchema> {
    return get<FormHydrationSchema>(
        cookieStore,
        `${apis.formHydrationV1UrlIP}?name=${schemaName}&version=${schemaVersion}`
    );
}

export {
    getFilters,
    getUser,
    getTeam,
    getApplication,
    getCohort,
    getDataset,
    getDataUse,
    getTool,
    getCollection,
    getFormHydration,
};
