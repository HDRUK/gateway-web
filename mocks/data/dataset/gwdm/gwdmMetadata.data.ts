/**
 * Synthetic native-GWDM metadata for tests. The shapes were derived from real
 * GWDM 2.0 (HDRUK) and GWDM 2.1 (CRUK) records with every value replaced by a
 * placeholder, so they track what the API actually returns without carrying
 * any real data. Enum codes (e.g. "GB-ENG", "OTHER") are kept as-is.
 */
/* eslint-disable */
const fixtures = {
    hdruk: {
        linkage: {
            tools: "https://example.com/tools",
            dataUses: "Example dataUses",
            isReferenceIn: "Example isReferenceIn",
            datasetLinkage: {
                isPartOf: "NOT APPLICABLE",
                isMemberOf: "Example isMemberOf",
                isDerivedFrom: "https://example.com/isDerivedFrom",
                linkedDatasets: "https://example.com/linkedDatasets",
            },
            investigations: "https://example.com/investigations",
            associatedMedia: null,
            isGeneratedUsing: "Example isGeneratedUsing",
            syntheticDataWebLink: null,
            publicationAboutDataset: null,
            publicationUsingDataset: null,
        },
        summary: {
            title: "Example Longitudinal Cohort",
            doiName: "10.1234/example.1",
            abstract: "Example abstract",
            keywords: "Example keyword 1,Example keyword 2",
            publisher: {
                name: "Example Data Custodian",
                rorId: null,
                gatewayId: null,
            },
            inPipeline: null,
            shortTitle: "Example Cohort",
            datasetType: "Example datasetType",
            description: "Example description",
            contactPoint: "user@example.com",
            datasetSubType: null,
            populationSize: 0,
            controlledKeywords: null,
        },
        coverage: {
            pathway: "NOT APPLICABLE",
            spatial: "https://example.com/spatial",
            followup: "UNKNOWN",
            typicalAgeRange: "Example typicalAgeRange",
            datasetCompleteness: null,
        },
        required: {
            issued: "2020-01-01T00:00:00.000Z",
            version: "Example version",
            modified: "2020-01-01T00:00:00.000Z",
            gatewayId: "Example gatewayId",
            revisions: [
                {
                    url: "https://example.com/url",
                    version: "Example version",
                },
                {
                    url: "https://example.com/url",
                    version: "Example version",
                },
            ],
            gatewayPid: "Example gatewayPid",
        },
        provenance: {
            origin: {
                source: "MACHINE GENERATED",
                purpose: "OTHER",
                imageContrast: null,
                collectionSituation: "OTHER",
            },
            temporal: {
                endDate: "2020-01-01",
                timeLag: "Example timeLag",
                startDate: "2020-01-01",
                accrualPeriodicity: "Example accrualPeriodicity",
                distributionReleaseDate: "2020-01-01",
            },
        },
        observations: [
            {
                observedNode: "Example observedNode",
                measuredValue: 575,
                observationDate: "2020-01-01",
                measuredProperty: "Example measuredProperty",
                disambiguatingDescription: "Example disambiguatingDescription",
            },
        ],
        accessibility: {
            usage: {
                resourceCreator: {
                    name: "Example name",
                    rorId: null,
                    gatewayId: null,
                },
                dataUseLimitation: "GENERAL RESEARCH USE",
                dataUseRequirement: "RETURN TO DATABASE OR RESOURCE",
            },
            access: {
                accessRights: "https://example.com/accessRights",
                jurisdiction: "GB-ENG",
                accessService: "https://example.com/accessService",
                dataProcessor: "Example Data Controller",
                dataController: "Example Data Controller",
                deliveryLeadTime: "Example deliveryLeadTime",
                accessRequestCost: "Example accessRequestCost",
                accessServiceCategory: "TRE",
            },
            formatAndStandards: {
                formats: "CSV,JSON",
                languages: "Example languages",
                conformsTo: "OTHER",
                vocabularyEncodingSchemes: "OTHER",
            },
        },
        structuralMetadata: [
            {
                name: "Example name",
                columns: [
                    {
                        name: "Example name",
                        values: null,
                        dataType: "Example dataType",
                        sensitive: false,
                        description: "Example description",
                    },
                ],
                description: "Example description",
            },
        ],
        tissuesSampleCollection: [
            {
                materialType: "Example materialType",
            },
            {
                materialType: "Example materialType",
            },
        ],
    },
    cruk: {
        erd: {
            image: "https://example.com/image",
            description: null,
        },
        icons: ["Example icons", "Example icons"],
        omics: null,
        linkage: {
            tools: null,
            dataUses: null,
            isReferenceIn: null,
            datasetLinkage: null,
            investigations: null,
            associatedMedia: null,
            isGeneratedUsing: null,
            syntheticDataWebLink: null,
            publicationAboutDataset: null,
            publicationUsingDataset: null,
        },
        summary: {
            title: "Example Cancer Biobank",
            doiName: "Example doiName",
            funders: null,
            abstract: "Example abstract",
            keywords:
                "Example keywords 1;,;Example keywords 2;,;Example keywords 3",
            publisher: {
                name: "Example Cancer Research Centre",
                rorId: null,
                gatewayId: "https://example.com/gatewayId",
            },
            inPipeline: null,
            shortTitle: "Example Biobank",
            datasetType: null,
            description: "Example description",
            contactPoint: "user@example.com",
            datasetAliases: null,
            datasetSubType: null,
            leadResearcher: "Example leadResearcher",
            populationSize: 2105,
            controlledKeywords: null,
            leadResearchInstitute: "Example leadResearchInstitute",
        },
        coverage: {
            pathway: null,
            spatial: null,
            followUp: null,
            typicalAgeRange: null,
            datasetCompleteness: null,
        },
        required: {
            issued: "2020-01-01T00:00:00.000Z",
            version: "Example version",
            modified: "2020-01-01T00:00:00.000Z",
            gatewayId: "Example gatewayId",
            revisions: [
                {
                    url: "https://example.com/url",
                    version: "Example version",
                },
            ],
            gatewayPid: "Example gatewayPid",
        },
        provenance: {
            origin: null,
            temporal: {
                endDate: null,
                timeLag: "Example timeLag",
                startDate: null,
                accrualPeriodicity: null,
                distributionReleaseDate: null,
            },
        },
        observations: [
            {
                observedNode: "Example observedNode",
                measuredValue: 4120,
                observationDate: "2020-01-01",
                measuredProperty: "Example measuredProperty",
                disambiguatingDescription: null,
            },
        ],
        accessibility: {
            usage: {
                resourceCreator: {
                    name: "Example name",
                    rorId: null,
                    gatewayId: null,
                },
                dataUseLimitation: "Example dataUseLimitation",
                dataUseRequirement: "Example dataUseRequirement",
            },
            access: {
                accessRights: "https://example.com/accessRights",
                jurisdiction: "GB-ENG",
                accessService: "https://example.com/accessService",
                dataProcessor: "Example dataProcessor",
                dataController: "Example dataController",
                deliveryLeadTime: "Example deliveryLeadTime",
                accessRequestCost: "Example accessRequestCost",
                accessServiceCategory: null,
            },
            formatAndStandards: {
                formats: "Example formats 1;,;Example formats 2",
                languages: "Example languages",
                conformsTo: "OTHER",
                vocabularyEncodingSchemes: "OTHER",
            },
        },
        projectGrants: [
            {
                pid: "GRANT-0001",
                grantNumber: "GRANT-0001",
                leadResearcher: "Example leadResearcher",
                projectGrantName: "Example projectGrantName",
                projectGrantScope: "Example projectGrantScope",
                projectGrantEndDate: "2020-01-01",
                leadResearchInstitute: "Example leadResearchInstitute",
                projectGrantStartDate: "2020-01-01",
            },
        ],
        datasetFilters: [
            {
                id: "Example id",
                label: "Example label",
                category: "Example category",
                description: "Example description",
                primaryGroup: "Example primaryGroup",
            },
            {
                id: "Example id",
                label: "Example label",
                category: "Example category",
                description: "Example description",
                primaryGroup: "Example primaryGroup",
            },
        ],
        structuralMetadata: null,
        demographicFrequency: null,
        tissuesSampleCollection: [],
    },
} as const;

export const hdrukGwdm20Metadata = fixtures.hdruk as unknown as Record<
    string,
    unknown
>;
export const crukGwdm21Metadata = fixtures.cruk as unknown as Record<
    string,
    unknown
>;
