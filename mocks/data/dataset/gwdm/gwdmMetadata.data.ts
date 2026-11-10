/**
 * Synthetic native-GWDM metadata for tests. The shapes were derived from real
 * GWDM 2.0 (HDRUK) and GWDM 2.1 (CRUK) records with every value replaced by a
 * placeholder, so they track what the API actually returns without carrying
 * any real data. Enum codes (e.g. "GB-ENG", "OTHER") are kept as-is.
 *
 * The GWDM 2.3 PRUK dataset and CROCOD case study are TRASER's output for
 * public study and trial records, with people and contacts replaced by
 * fictional placeholders. The case study's learnings are synthetic - its
 * source record has none.
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
    pruk: {
        required: {
            gatewayId: "placeholder",
            gatewayPid: "placeholder",
            issued: "2015-11-02T00:00:00.000Z",
            modified: "2025-10-14T10:36:03.207Z",
            version: "1.0.0",
            revisions: [],
            recordType: "dataset",
        },
        summary: {
            abstract:
                "Generation Scotland (Scottish Family Health Study) is an intensively phenotyped, family-based cohort for the study of the genetic basis of common complex diseases and response to treatments. This record covers the 2015 genotyping: DNA from over 20,000 GS:SFHS participants analysed by high-density genome-wide chip genotyping (Illumina OmniExpress SNP GWAS, 700k) and exome chip (250K).",
            contactPoint: "user@example.com",
            keywords:
                "genetics;,;family-based cohort;,;genotyping;,;complex disease;,;Scotland",
            controlledKeywords: null,
            datasetType: null,
            datasetSubType: null,
            populationSize: 20000,
            description:
                "Genome-wide genotyping (Illumina OmniExpress 700k, exome chip 250k) carried out in 2015 on DNA extracted from blood/saliva samples collected during the main Generation Scotland recruitment (2006-2011). QC included population stratification analysis and imputation to the 1000 Genomes dataset.",
            doiName: null,
            shortTitle: "Generation Scotland — 2015 Genotyping",
            title: "Generation Scotland — 2015 Genotyping",
            datasetAliases: null,
            publisher: {
                name: "University of Edinburgh",
                gatewayId: "uk.genscot.edinburgh",
                rorId: null,
            },
            inPipeline: "Not available",
            funders: null,
        },
        coverage: {
            pathway: null,
            spatial: "Scotland",
            followUp: "Unknown",
            typicalAgeRange: "18-99",
            datasetCompleteness: null,
        },
        provenance: {
            origin: null,
            temporal: {
                endDate: "2015-12-31",
                startDate: "2015-01-01",
                timeLag: "Not applicable",
                accrualPeriodicity: "Static",
                distributionReleaseDate: null,
            },
        },
        accessibility: {
            access: {
                deliveryLeadTime: null,
                jurisdiction: null,
                dataController: null,
                dataProcessor: null,
                accessRights: "https://www.generationscotland.org/access",
                accessService: null,
                accessRequestCost: null,
                accessServiceCategory: null,
            },
            usage: {
                dataUseLimitation: null,
                dataUseRequirement: null,
                resourceCreator: {
                    name: null,
                    gatewayId: null,
                    rorId: null,
                },
                duoCodes: null,
                patientRecontact: "Yes",
            },
            formatAndStandards: {
                vocabularyEncodingSchemes: null,
                conformsTo: null,
                languages: null,
                formats: null,
            },
        },
        linkage: {
            isGeneratedUsing: null,
            associatedMedia: null,
            dataUses: null,
            isReferenceIn: null,
            tools: null,
            datasetLinkage: {
                isDerivedFrom: null,
                isPartOf: null,
                isMemberOf: null,
                linkedDatasets: null,
                waveOf: [
                    {
                        pid: "9a4d4a54-6256-467b-b1f2-45c02aeb60fb",
                        title: "Generation Scotland (Scottish Family Health Study)",
                        url: "https://www.generationscotland.org",
                    },
                ],
            },
            investigations: null,
            publicationAboutDataset: null,
            publicationUsingDataset: null,
            syntheticDataWebLink: null,
        },
        observations: [],
        tissuesSampleCollection: [],
        demographicFrequency: null,
        omics: {
            assay: "Genotyping by array",
            platform: "Illumina",
        },
        population: {
            studyDesign: {
                isLongitudinal: true,
                isFamilyBased: true,
                isClinicalBased: false,
            },
            wave: {
                waveId: "genotyping-2015",
                waveType: "Sub-study",
                label: "2015 genotyping",
                waveNumber: null,
            },
            recruitment: {
                status: "Closed",
                startDate: "2006-01-01",
                endDate: "2011-12-31",
                samplingMethod:
                    "Recruited via participating family members, primarily through general practices across Scotland.",
            },
            followUpSchedule: {
                frequency: "No scheduled follow-up",
                note: "Participants are not re-contacted on a schedule. Ongoing information comes from linked administrative and health records.",
            },
            eligibility: {
                inclusionCriteria:
                    "Adults (18+) with at least one first-degree relative also willing to participate.",
                exclusionCriteria: null,
            },
        },
        structuralMetadata: null,
        icons: null,
        projectGrants: null,
        datasetFilters: null,
        erd: null,
        crocod: null,
    },
    crocod: {
        required: {
            gatewayId: "placeholder",
            gatewayPid: "placeholder",
            issued: "2026-10-20T00:00:00.000Z",
            modified: "2026-10-20T00:00:00.000Z",
            version: "1.0.0",
            revisions: [],
            recordType: "caseStudy",
        },
        summary: {
            title: "Lowering events in non-proliferative retinopathy in Scotland",
            shortTitle: "LENS",
            abstract:
                "Lowering events in non-proliferative retinopathy in Scotland",
            description:
                "<p>Diabetic retinopathy is a common complication of diabetes mellitus which can result in loss of vision. For this reason, individuals with diabetes are routinely invited for retinal screening. In Scotland, this screening is carried out by the national Diabetic Eye Screening (DES) programme. The programme takes images of the eyes which are then assessed according to the DES programme grading scheme. In the event of diabetes-related changes to the eyes, the individual may be invited to begin treatment.</p>",
            populationSize: 1151,
            contactPoint: "trial.contact@example.com",
            funders: "NIHR – Health Technology Assessment",
            publisher: {
                name: "Example Team",
                gatewayId: "example-team-pid",
                rorId: null,
            },
            doiName: null,
            keywords: null,
            controlledKeywords: null,
            datasetType: null,
            datasetSubType: null,
            inPipeline: "Not available",
        },
        coverage: {
            spatial: "Scotland",
            pathway: null,
            followUp: null,
            typicalAgeRange: null,
            datasetCompleteness: null,
        },
        provenance: {
            temporal: {
                accrualPeriodicity: "Static",
                timeLag: "Not applicable",
                startDate: "2016-01-01",
                endDate: null,
                distributionReleaseDate: null,
            },
            origin: null,
        },
        accessibility: {
            access: {
                accessRights: null,
                accessService: null,
                accessRequestCost: null,
                deliveryLeadTime: null,
                jurisdiction: null,
                dataController: null,
                dataProcessor: null,
                accessServiceCategory: null,
            },
            usage: null,
            formatAndStandards: null,
        },
        linkage: {
            datasetLinkage: {
                linkedDatasets: [
                    {
                        pid: null,
                        title: "SMR00 outpatient attendance",
                        url: null,
                    },
                    {
                        pid: null,
                        title: "SMR01 general acute inpatient and day case",
                        url: null,
                    },
                    {
                        pid: null,
                        title: "NRS deaths data",
                        url: null,
                    },
                    {
                        pid: null,
                        title: "Prescribing information system",
                        url: null,
                    },
                    {
                        pid: null,
                        title: "SCI-Diabetes",
                        url: null,
                    },
                    {
                        pid: null,
                        title: "NHS Scotland Diabetic Eye Screening Programme",
                        url: null,
                    },
                ],
                isDerivedFrom: null,
                isPartOf: null,
                isMemberOf: null,
                waveOf: null,
            },
            isGeneratedUsing: null,
            associatedMedia: null,
            dataUses: null,
            isReferenceIn: null,
            tools: null,
            investigations: null,
            syntheticDataWebLink: null,
            publicationAboutDataset: null,
            publicationUsingDataset: null,
        },
        crocod: {
            trialStatus: "Completed",
            therapeuticArea: "Diabetic retinopathy",
            laySummary: null,
            background:
                "<p>Diabetic retinopathy is a common complication of diabetes mellitus which can result in loss of vision. For this reason, individuals with diabetes are routinely invited for retinal screening. In Scotland, this screening is carried out by the national Diabetic Eye Screening (DES) programme. The programme takes images of the eyes which are then assessed according to the DES programme grading scheme. In the event of diabetes-related changes to the eyes, the individual may be invited to begin treatment.</p>",
            trialDesign: {
                categories: "Double-masked, placebo-controlled RCT, phase IV",
                designDescription: null,
                registration: "NCT03439345, ISRCTN15073006",
            },
            governance: {
                sponsor: "University of Oxford",
                funder: "NIHR – Health Technology Assessment",
                approvingBody:
                    "Application approved by: Public Benefit and Privacy Panel for Health and Social Care (PBPP)",
                principalInvestigator: "Professor Jane Doe",
                contactPoints: ["trial.contact@example.com"],
            },
            healthSystemsData: {
                usedFor: [
                    "Recruitment",
                    "Outcome ascertainment",
                    "Pharmacovigilance",
                ],
                dataProvidersAppliedTo: [
                    {
                        title: "Public Health Scotland",
                        gatewayId: null,
                        url: null,
                    },
                ],
                datasetsAccessed: [
                    {
                        title: "SMR00 outpatient attendance",
                        gatewayId: null,
                        url: null,
                    },
                    {
                        title: "SMR01 general acute inpatient and day case",
                        gatewayId: null,
                        url: null,
                    },
                    {
                        title: "NRS deaths data",
                        gatewayId: null,
                        url: null,
                    },
                    {
                        title: "Prescribing information system",
                        gatewayId: null,
                        url: null,
                    },
                    {
                        title: "SCI-Diabetes",
                        gatewayId: null,
                        url: null,
                    },
                    {
                        title: "NHS Scotland Diabetic Eye Screening Programme",
                        gatewayId: null,
                        url: null,
                    },
                ],
                yearFirstAppliedFor: 2016,
            },
            learnings: {
                recruitment: {
                    tags: [
                        "Example recruitment tag 1",
                        "Example recruitment tag 2",
                    ],
                    summary: "Example recruitment summary",
                    content:
                        "<p>Example recruitment learnings.</p><blockquote>Example quote.</blockquote>",
                },
                pharmacovigilance: null,
                outcomeAscertainment: {
                    tags: null,
                    summary: "Example outcome ascertainment summary",
                    content: "<p>Example outcome ascertainment learnings.</p>",
                },
                patientPublicInvolvement: null,
                additionalInsights: "<p>Example additional insights.</p>",
            },
            publications: [
                {
                    title: "Effect of Fenofibrate on Progression of Diabetic Retinopathy",
                    gatewayId: null,
                    url: null,
                },
                {
                    title: "Design, recruitment, and baseline characteristics of the LENS trial",
                    gatewayId: null,
                    url: null,
                },
            ],
            readMore: ["LENS protocol", "LENS statistical analysis plan"],
        },
        observations: null,
        structuralMetadata: null,
        tissuesSampleCollection: null,
        demographicFrequency: null,
        omics: null,
        icons: null,
        projectGrants: null,
        datasetFilters: null,
        erd: null,
        population: null,
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
export const prukGwdm23Metadata = fixtures.pruk as unknown as Record<
    string,
    unknown
>;
export const crocodGwdm23Metadata = fixtures.crocod as unknown as Record<
    string,
    unknown
>;
