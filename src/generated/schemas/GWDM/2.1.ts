/* eslint-disable */
/**
 * AUTO-GENERATED from HDRUK/schemata-2 (master):
 * hdr_schemata/models/GWDM/2.1/schema.json
 * via `npm run generate:schema-types`. DO NOT HAND-EDIT.
 * NOTE: json-schema-to-typescript suffixes duplicate $defs titles (e.g.
 * Documentation1, Coverage1) when the same title appears on multiple schema
 * nodes - this is cosmetic.
 */

/**
 * Associated identifier (number) that is the BigInt key in our SQL database for the dataset version associated with this metadata
 */
export type GatewayIdentifier = string;
/**
 * A unique persistent identifier for the metadata version. This is a 128-bit unique identifiers, as 32 hexadecimal digits separated by hyphens
 */
export type GatewayPersistentIdentifier = string;
/**
 * Datetime stamp of when this metadata version was initially issued
 */
export type MetadataIssuedDatetime = string;
/**
 * Datetime stamp of when this metadata was last modified
 */
export type LastModifiedDatetime = string;
/**
 * Version number used for previous version of this dataset
 */
export type RevisionVersion = string;
/**
 * Some url with a reference to the record of a previous version of this dataset
 */
export type RevisionUrl = Url | null;
export type Url = string | null;
/**
 * A list of persistent identifiers and version numbers for previous versions of metadata for this dataset
 */
export type MetadataVersionRevisions = Revision[];
/**
 * Dataset metadata version
 */
export type DatasetVersion = string;
/**
 * The main title of the dataset
 */
export type Title = TwoHundredFiftyFiveCharacters;
export type TwoHundredFiftyFiveCharacters = string;
/**
 * A shorter descriptive title of the dataset
 */
export type ShortTitle = ShortTitle1 | null;
export type ShortTitle1 = string | null;
/**
 * DOI associated to this dataset
 */
export type DOIName = Doi | null;
export type Doi = string | null;
/**
 * Longer abstract detailing the dataset.
 */
export type Abstract = LongAbstractText;
export type LongAbstractText = string | null;
/**
 * Comma separated key words associated to this dataset.
 */
export type Keywords = CommaSeparatedValues | null;
export type CommaSeparatedValues = string | null;
/**
 * Keywords that have been filtered and limited
 */
export type ControlledKeywords = CommaSeparatedValues | null;
/**
 * email of a person who can be the main contact point of this dataset
 */
export type ContactPoint = string | null;
/**
 * What type of dataset is this?
 */
export type DatasetType = CommaSeparatedValues | null;
/**
 * Longer description of the dataset in detail
 */
export type Description = LongDescription | null;
export type LongDescription = string | null;
/**
 * Link to details about the publisher of this dataset
 */
export type Publisher = Organisation | null;
/**
 * Name of the organisation
 */
export type OrganisationName = Name | null;
/**
 * Identifier on the gateway
 */
export type OrganisationGatewayIdentifier = string | null;
/**
 * The Research Organization Registry (ROR) for the organisation, if applicable
 */
export type ResearchOrganizationRegistryIdentifier = string | null;
/**
 * Summary population size of the cohort
 */
export type PopulationSize = number | null;
/**
 * Placeholder for dataset sub-type
 */
export type DatasetSubType = CommaSeparatedValues | null;
/**
 * Indicate whether this dataset is currently available for Researchers to request access.
 */
export type DatasetPipelineStatus = Pipeline | null;
export type Pipeline = "Available" | "Not available";
/**
 * Comma-separated list of funders for this dataset.
 */
export type FundedBy = CommaSeparatedValues | null;
/**
 * This information includes attributes for geographical and temporal coverage, cohort details etc. to enable a deeper understanding of the dataset content so that researchers can make decisions about the relevance of the underlying data.
 */
export type Coverage = Coverage1 | null;
/**
 * The geographical area covered by the dataset. It is recommended that links are to entries in a well-maintained gazetteer such as https://www.geonames.org/ or https://what3words.com/daring.lion.race.
 */
export type GeographicCoverage = CommaSeparatedValues | null;
/**
 * Please indicate if the dataset is representative of the patient pathway and any limitations the dataset may have with respect to pathway coverage. This could include if the dataset is from a single speciality or area, a single tier of care, linked across two tiers (e.g. primary and secondary care), or an integrated care record covering the whole patient pathway.
 */
export type Pathway = LongDescription | null;
/**
 * If known, what is the typical time span that a patient appears in the dataset (follow up period)
 */
export type Followup = FollowupV2 | null;
export type FollowupV2 =
    | "0 - 6 Months"
    | "6 - 12 Months"
    | "1 - 10 Years"
    | "> 10 Years"
    | "Unknown"
    | "Continuous"
    | "Other"
    | null;
/**
 * Please indicate the age range in whole years of participants in the dataset. Please provide range in the following format '[min age] – [max age]' where both the minimum and maximum are whole numbers (integers).
 */
export type AgeRange = AgeRange1 | null;
export type AgeRange1 = string | null;
/**
 * The URL where a Researcher can learn more about the completeness of the dataset.
 */
export type DatasetCoverageCompletenessQuality = Url | null;
/**
 * Provenance information allows researchers to understand data within the context of its origins and can be an indicator of quality, authenticity and timeliness.
 */
export type Provenance = Provenance1 | null;
/**
 * Please indicate the purpose(s) that the dataset was collected.
 */
export type Purpose = CommaSeparatedValues | null;
/**
 * Please indicate the source of the data extraction
 */
export type Source = CommaSeparatedValues | null;
/**
 * Please indicate the setting(s) where data was collected. Multiple settings may be provided
 */
export type CollectionSituationSetting = CommaSeparatedValues | null;
/**
 * Indicate whether usage of imaging contrast is captured within the dataset.
 */
export type ImageContrast = Ternary | null;
export type Ternary = "Yes" | "No" | "Not stated";
/**
 * The start of the time period that the dataset provides coverage for. If there are multiple cohorts in the dataset with varying start dates, please provide the earliest date and use the description or the media attribute to provide more information.
 */
export type StartDate = string | null;
/**
 * The end of the time period that the dataset provides coverage for. If the dataset is “Continuous” and has no known end date, please state continuous. If there are multiple cohorts in the dataset with varying end dates, please provide the latest date and use the description or the media attribute to provide more information.'
 */
export type EndDate = string | null;
/**
 * Please indicate the typical time-lag between an event and the data for that event appearing in the dataset
 */
export type TimeLag = TimeLagV2;
export type TimeLagV2 =
    | "Less than 1 week"
    | "1-2 weeks"
    | "2-4 weeks"
    | "1-2 months"
    | "2-6 months"
    | "More than 6 months"
    | "Variable"
    | "Not applicable"
    | "Other";
/**
 * Please indicate the frequency of distribution release. If a dataset is distributed regularly please choose a distribution release periodicity from the constrained list and indicate the next release date. When the release date becomes historical, a new release date will be calculated based on the publishing periodicity. If a dataset has been published and will remain static please indicate that it is static and indicated when it was released. If a dataset is released on an irregular basis or “on-demand” please indicate that it is Irregular and leave release date as null. If a dataset can be published in real-time or near-real-time please indicate that it is continuous and leave release date as null. Notes: see https://www.dublincore.org/specifications/dublin-core/collection-description/frequency/
 */
export type Periodicity = PeriodicityV2;
export type PeriodicityV2 =
    | "Static"
    | "Irregular"
    | "Continuous"
    | "Biennial"
    | "Annual"
    | "Biannual"
    | "Quarterly"
    | "Bimonthly"
    | "Monthly"
    | "Biweekly"
    | "Weekly"
    | "Twice a week"
    | "Daily"
    | "Other"
    | null;
/**
 * Date of the latest release of the dataset. If this is a regular release i.e. quarterly, or this is a static dataset please complete this alongside Periodicity. If this is Irregular or Continuously released please leave this blank. Notes: Periodicity and release date will be used to determine when the next release is expected. E.g. if the release date is documented as 01/01/2020 and it is now 20/04/2020 and there is a quarterly release schedule, the latest release will be calculated as 01/04/2020.
 */
export type ReleaseDate = string | null;
/**
 * This section includes information about how the data can be used and how it is currently being used
 */
export type Usage = Usage1 | null;
/**
 * Please provide an indication of consent permissions for datasets and/or materials, and relates to the purposes for which datasets and/or material might be removed, stored or used. NOTE: we have extended the DUO to include a value for NO LINKAGE
 */
export type DataUseLimitation = CommaSeparatedValues | null;
/**
 * Please indicate fit here are any additional conditions set for use if any, multiple requirements may be provided. Please ensure that these restrictions are documented in access rights information.
 */
export type DataUseRequirements = CommaSeparatedValues | null;
/**
 * Please provide the text that you would like included as part of any citation that credits this dataset. This is typically just the name of the publisher.   No employee details should be provided.'
 */
export type CitationRequirements = Organisation | null;
/**
 * Please provide details for the data access rights
 */
export type AccessRights = CommaSeparatedValues | null;
/**
 * Please provide a brief description of the data access services that are available including: environment that is currently available to researchers;additional consultancy and services;any indication of costs associated. If no environment is currently available, please indicate the current plans and timelines when and how data will be made available to researchers Note: This value will be used as default access environment for all datasets submitted by the organisation. However, there will be the opportunity to overwrite this value for each dataset.
 */
export type AccessService = LongDescription | null;
/**
 * Please provide link(s) to a webpage detailing the commercial model for processing data access requests for the organisation (if available) Definition: Indication of commercial model or cost (in GBP) for processing each data access request by the data custodian.
 */
export type OrganisationAccessRequestCost = LongDescription | null;
/**
 * Please provide an indication of the typical processing times based on the types of requests typically received.
 */
export type AccessRequestDuration = DeliveryLeadTimeV2 | null;
export type DeliveryLeadTimeV2 =
    | "Less than 1 week"
    | "1-2 weeks"
    | "2-4 weeks"
    | "1-2 months"
    | "2-6 months"
    | "More than 6 months"
    | "Variable"
    | "Not applicable"
    | "Other";
/**
 * Please use country code from ISO 3166-1 country codes and the associated ISO 3166-2 for regions, cities, states etc. for the country/state under whose laws the data subjects' data is collected, processed and stored.
 */
export type Jurisdiction = CommaSeparatedValues | null;
/**
 * Data Controller means a person/entity who (either alone or jointly or in common with other persons/entities) determines the purposes for which and the way any Data Subject data, specifically personal data or are to be processed.
 */
export type DataController = LongDescription | null;
/**
 * A Data Processor, in relation to any Data Subject data, specifically personal data, means any person/entity (other than an employee of the data controller) who processes the data on behalf of the data controller.
 */
export type DataProcessor = LongDescription | null;
/**
 * Where access to data come from: TRE/SED, direct access, open acccess, varies based on project.
 */
export type AccessGovernanceRequirements = CommaSeparatedValues | null;
/**
 * Section includes technical attributes for language vocabularies, sizes etc. and gives researchers facts about and processing the underlying data in the dataset.
 */
export type FormatAndStandards = FormatAndStandards1 | null;
/**
 * Code value of the ontology vocabulary encoding
 */
export type ControlledVocabulary = CommaSeparatedValues | null;
/**
 * What the vocabulary conforms to.
 */
export type ConformsTo = CommaSeparatedValues | null;
/**
 * Language code(s) of the language of the dataset metadata and underlying data is made available.
 */
export type LanguageCodeS = CommaSeparatedValues | null;
/**
 * Format(s) the dataset can be made available in
 */
export type DatasetFormat = CommaSeparatedValues | null;
/**
 * Metadata for various linkages with datasets and other gateway entities
 */
export type Linkage = Linkage1 | null;
/**
 * ??
 */
export type IsGeneratedUsing = CommaSeparatedValues | null;
/**
 * Any media associated with the Gateway Organisation using a valid URI for the content. This is an opportunity to provide additional context that could be useful for researchers wanting to understand more about the dataset and its relevance to their research question
 */
export type AssociatedMedia = CommaSeparatedValues | null;
/**
 * ??
 */
export type DataUses = CommaSeparatedValues | null;
/**
 * The keystone paper associated with the dataset. Also include a list of known citations, if available and should be links to existing resources where the dataset has been used or referenced.',
 */
export type IsReferenceIn = CommaSeparatedValues | null;
/**
 * URL of any analysis tools or models that have been created for this dataset and are available for further use
 */
export type Tools = CommaSeparatedValues | null;
/**
 * Dataset Linkage copied over from
 */
export type DatasetLinkage = DatasetLinkage1 | null;
/**
 * Indicate if derived datasets or predefined extracts are available and the type of derivation available. Notes. Single or multiple dimensions can be provided as a derived extract alongside the dataset
 */
export type Derivations = DatasetDescriptor[] | null;
export type PersistentIdentifierOfADataset = OneHundredFiftyCharacters | null;
export type OneHundredFiftyCharacters = string;
export type TitleOfADataset = OneHundredFiftyCharacters | null;
export type UrlOfADataset = Url | null;
/**
 * If the dataset is part of a group or family
 */
export type IsPartOf = DatasetDescriptor[] | null;
/**
 * Links to other datasets.
 */
export type LinkedDatasets = DatasetDescriptor[] | null;
/**
 * Dataset is a member of XXX(?)
 */
export type IsMemberOf = DatasetDescriptor[] | null;
/**
 * Please provide the keystone paper associated with the dataset.
 */
export type Investigations = CommaSeparatedValues | null;
/**
 * Links to locations of information and or raw downloads of synthetic data associated with this dataset
 */
export type SyntheticDataWebLinks = CommaSeparatedValues | null;
/**
 * DOIs for publications which describe the dataset.
 */
export type PublicationAboutTheDataset = Doi[] | null;
/**
 * DOIs for publications which use the dataset for analysis.
 */
export type PublicationUsingTheDataset = Doi[] | null;
/**
 * Multiple observations about the dataset may be provided and users are expected to provide at least one observation
 * (1..*). We will be supporting the schema.org observation model (https://schema.org/Observation) with default values. Users will be encouraged to provide their own statistical populations as the project progresses.
 * Example:
 *       &lt;b&gt; Statistical Population 1
 *       &lt;/b&gt; type: StatisticalPopulation populationType: Persons numConstraints: 0
 *       &lt;b&gt; Statistical Population 2 &lt;/b&gt; type: StatisticalPopulation populationType: Events numConstraints: 0 &lt;b&gt; Statistical Population 3 &lt;/b&gt; type: StatisticalPopulation populationType: Findings numConstraints: 0 typeOf: Observation observedNode: &lt;b&gt; Statistical Population 1 &lt;/b&gt; measuredProperty: count measuredValue: 32937 observationDate: “2017”"
 *
 */
export type Observations = Observation[] | null;
/**
 * Please select one of the following statistical populations for you observation
 */
export type StatisticalPopulation = StatisticalPopulationConstrainedV2;
export type StatisticalPopulationConstrainedV2 =
    | "Persons"
    | "Events"
    | "Findings"
    | "Number of scans per modality";
/**
 * Please provide the population size associated with the population type the dataset i.e. 1000 people in a study, or 87 images (MRI) of Knee Usage Note: Used with Statistical Population, which specifies the type of the population in the dataset.
 */
export type MeasuredValue = number;
/**
 * If SNOMED CT term does not provide sufficient detail, please provide a description that disambiguates the population type.
 */
export type DisambiguatingDescription = AbstractText | null;
export type AbstractText = string | null;
/**
 * Please provide the date that the observation was made. Some datasets may be continuously updated and the number of records will change regularly, so the observation date provides users with the date that the analysis or query was run to generate the particular observation. Multiple observations can be made i.e. an observation of cumulative COVID positive cases by specimen on the 1/1/2021 could be 2M. On the 8/1/2021 a new observation could be 2.1M. Users can add multiple observations.
 */
export type ObservationDate = string;
/**
 * Initially this will be defaulted to "COUNT"
 */
export type MeasuredProperty = MeasuredProperty1;
/**
 * Descriptions of all tables and data elements that can be included in the dataset
 */
export type StructuralMetadata = DataTable[] | null;
/**
 * The name of a table in a dataset.
 */
export type TableName = string | null;
/**
 * A description of a table in a dataset.
 */
export type TableDescription = string | null;
/**
 * The name of a column in a table.
 */
export type ColumnName = Name;
/**
 * The name of a column in a table.
 */
export type ColumnName1 = string;
/**
 * A description of a column in a table.
 */
export type ColumnDescription = string | null;
/**
 * A True or False value, indicating if the field is sensitive or not
 */
export type Sensitive = boolean;
/**
 * values in a dataset
 */
export type Values = DataValue[] | null;
/**
 * Unique value in a column .
 */
export type ValueName = Name;
/**
 * A description of a unique value in a column.
 */
export type ValueDescription = string | null;
/**
 * The frequency of occurrance of a value in a column
 */
export type ValueFrequency = number | null;
/**
 * A list of columns contained within a table in a dataset.
 */
export type DataColumns = DataColumn[];
/**
 * metedata for tissue samples
 */
export type TissueSampleCollection = TissuesSampleCollection[] | null;
/**
 * ID of the tissue sample collection
 */
export type ID = CommaSeparatedValues | null;
/**
 * The type of data that is associated with the samples in the study. Can be several values MIABIS-2.0-13
 */
export type DataCategories = CommaSeparatedValues | null;
/**
 * The biospecimen saved from a biological entity for propagation e.g. testing, diagnostics, treatment or research purposes. Can be several values MIABIS-2.0-14
 */
export type MaterialType = CommaSeparatedValues | null;
/**
 * Access conditions for the tissue sample collection
 */
export type AccessConditions = CommaSeparatedValues | null;
/**
 * The type of the sample collection. Can be several values [MIABIS-2.0-16](https://github.com/BBMRI-ERIC/miabis/blob/master/Structured-data-and-lists.md#collection-type)
 */
export type CollectionType = CommaSeparatedValues | null;
/**
 * Disease associated with the tissue sample collection
 */
export type Disease = CommaSeparatedValues | null;
/**
 * Storage temperature of the tissue sample collection
 */
export type StorageTemperature = CommaSeparatedValues | null;
/**
 * Age range of the tissue sample collection
 */
export type SampleAgeRange = CommaSeparatedValues | null;
/**
 * Metadata related to the tissue sample
 */
export type TissueSampleMetadata = TissueSampleMetadata1 | null;
/**
 * ID of the tissue sample metadata
 */
export type MetadataID = string | null;
/**
 * Information about the sample donor
 */
export type SampleDonor = SampleDonor1 | null;
/**
 * ID of the sample donor
 */
export type DonorID = string | null;
/**
 * Sex of the sample donor
 */
export type DonorSex = string | null;
/**
 * Date of birth of the sample donor
 */
export type DonorBirthDate = string | null;
/**
 * Data categories related to the sample donor
 */
export type DonorDataCategories = CommaSeparatedValues | null;
/**
 * Type of the tissue sample
 */
export type SampleType = CommaSeparatedValues | null;
/**
 * Storage temperature of the tissue sample
 */
export type StorageTemperature1 = string | null;
/**
 * Date when the tissue sample metadata was created
 */
export type CreationDate = string | null;
/**
 * Ontology code for the anatomical site, this code must match an ICD-0-3 format
 */
export type AnatomicalSiteOntologyCode = CommaSeparatedValues | null;
/**
 * Ontology description for the anatomical site
 */
export type AnatomicalSiteOntologyDescription = CommaSeparatedValues | null;
/**
 * Free text describing the anatomical site
 */
export type AnatomicalSiteFreeText = CommaSeparatedValues | null;
/**
 * Diagnosis related to the sample content
 */
export type SampleContentDiagnosis = CommaSeparatedValues | null;
/**
 * Restrictions on the use of the tissue sample
 */
export type UseRestrictions = CommaSeparatedValues | null;
/**
 * An object containing demographic frequency data categorised by age, ethnicity, and disease attributes.
 */
export type DemographicFrequency = DemographicFrequency1 | null;
/**
 * Array of age bins and their corresponding counts.
 */
export type Age = Age1[] | null;
export type AgeBin = AgeEnum;
export type AgeEnum =
    | "0-6 days"
    | "7-27 days"
    | "1-11 months"
    | "1-4 years"
    | "5-9 years"
    | "10-14 years"
    | "15-19 years"
    | "20-24 years"
    | "25-29 years"
    | "30-34 years"
    | "35-39 years"
    | "40-44 years"
    | "45-49 years"
    | "50-54 years"
    | "55-59 years"
    | "60-64 years"
    | "65-69 years"
    | "70-74 years"
    | "75-79 years"
    | "80-84 years"
    | "85-89 years"
    | "90-94 years"
    | "95-99 years"
    | "100+ years";
export type AgeCount = number;
/**
 * Array of ethnicity bins and their corresponding counts.
 */
export type Ethnicity = Ethnicity1[] | null;
export type EthnicityBin = EthnicityEnum;
export type EthnicityEnum =
    | "White - British"
    | "White - Irish"
    | "White - Any other White background"
    | "Mixed - White and Black Caribbean"
    | "Mixed - White and Black African"
    | "Mixed - White and Asian"
    | "Mixed - Any other mixed background"
    | "Asian or Asian British - Indian"
    | "Asian or Asian British - Pakistani"
    | "Asian or Asian British - Bangladeshi"
    | "Asian or Asian British - Any other Asian background"
    | "Black or Black British - Caribbean"
    | "Black or Black British - African"
    | "Black or Black British - Any other Black background"
    | "Other Ethnic Groups - Chinese"
    | "Other Ethnic Groups - Any other ethnic group"
    | "Not stated"
    | "Not known";
export type EthnicityCount = number;
/**
 * Array of diseases and their corresponding counts.
 */
export type Disease1 = Disease2[] | null;
export type DiseaseCode = string | number;
export type DiseaseCodeVocabulary = DiseaseCodeEnum;
export type DiseaseCodeEnum = "ICD10" | "SNOMED CT" | "MeSH";
export type DiseaseCount = number;
/**
 * Omics
 */
export type Omics = Omics1 | null;
/**
 * The specific 'omics assay that generated the dataset.
 */
export type OmicsAssay = Assay | null;
export type Assay =
    | "NMR spectroscopy"
    | "Mass-spectrometry"
    | "Whole genome sequencing"
    | "Exome sequencing"
    | "Genotyping by array"
    | "Transcriptome profiling by high-throughput sequencing"
    | "Transcriptome profiling by array"
    | "Amplicon sequencing"
    | "Methylation binding domain sequencing"
    | "Methylation profiling by high-throughput sequencing"
    | "Genomic variant calling"
    | "Chromatin accessibility profiling by high-throughput sequencing"
    | "Histone modification profiling by high-throughput sequencing"
    | "Chromatin immunoprecipitation sequencing"
    | "Whole genome shotgun sequencing"
    | "Whole transcriptome sequencing"
    | "Targeted mutation analysis";
/**
 * The specific technology or infrastructure used to perform the assay. If the omics platform used to create your dataset is not listed, please select other, a member of the gateway team will contact you to add an appropriate term(s) both to your record and to the metadata schema on your behalf.
 */
export type OmicsPlatform = Platform | null;
export type Platform =
    | "Other"
    | "NMR Nightingale"
    | "Metabolon"
    | "Biocrates"
    | "Illumina"
    | "Oxford Nanopore"
    | "454"
    | "Hi-C"
    | "HiFi";
/**
 * Calculated categorization icons added during export.
 */
export type Icons = string[] | null;
export type AssociatedProjectGrants = ProjectGrant[] | null;
export type PersistentIdentifierOfTheStudy = OneHundredFiftyCharacters | null;
/**
 * The Project Grant Title should be unique to the CRUK datahub. (Add your institute or name if necessary to disambiguate).
 */
export type ProjectGrantTitle = OneHundredFiftyCharacters;
export type LeadResearcher = OneHundredFiftyCharacters;
export type LeadResearchInstitute = OneHundredFiftyCharacters;
/**
 * List of CRUK and any other grant numbers.
 */
export type GrantNumberS = string;
/**
 * Starting date of projectGrant grant.
 */
export type ProjectStartDate = string;
/**
 * Current end date of project grant.
 */
export type ProjectEndDate = string | null;
/**
 * data and biospecimens expected to result from the grant.
 */
export type ProjectScope = string | null;
/**
 * Categorization tags regarding cancer type, data type, and access.
 */
export type Datasetfilters = DatasetFilter[] | null;
export type Id = string;
export type Label = string;
export type Category = string;
export type PrimaryGroup = "cancer-type" | "data-type" | "access-type";
export type Description1 = string;
/**
 * Visual representation of data table relationships.
 */
export type EntityRelationshipDiagram = Image | null;
/**
 * An image file.
 */
export type Image1 = string | null;
export type Description2 = string | null;

export interface Gwdm21 {
    /**
     * Required metadata needed for the GWDM
     */
    required: Required;
    /**
     * Summary of metadata describing key pieces of information.
     */
    summary: Summary;
    coverage?: Coverage;
    provenance?: Provenance;
    /**
     * Accessibility information allows researchers to understand access, usage, limitations, formats, standards and linkage or interoperability with toolsets.
     */
    accessibility: Accessibility;
    linkage?: Linkage;
    observations?: Observations;
    structuralMetadata?: StructuralMetadata;
    tissuesSampleCollection?: TissueSampleCollection;
    demographicFrequency?: DemographicFrequency;
    omics?: Omics;
    icons?: Icons;
    projectGrants?: AssociatedProjectGrants;
    datasetFilters?: Datasetfilters;
    erd?: EntityRelationshipDiagram;
}
export interface Required {
    gatewayId: GatewayIdentifier;
    gatewayPid: GatewayPersistentIdentifier;
    issued: MetadataIssuedDatetime;
    modified: LastModifiedDatetime;
    revisions: MetadataVersionRevisions;
    version: DatasetVersion;
    [k: string]: unknown;
}
export interface Revision {
    version: RevisionVersion;
    url: RevisionUrl;
    [k: string]: unknown;
}
export interface Summary {
    title: Title;
    shortTitle?: ShortTitle;
    doiName?: DOIName;
    abstract: Abstract;
    keywords?: Keywords;
    controlledKeywords?: ControlledKeywords;
    contactPoint?: ContactPoint;
    datasetType?: DatasetType;
    description?: Description;
    publisher?: Publisher;
    populationSize?: PopulationSize;
    datasetSubType?: DatasetSubType;
    inPipeline?: DatasetPipelineStatus;
    funders?: FundedBy;
    [k: string]: unknown;
}
export interface Organisation {
    name?: OrganisationName;
    gatewayId?: OrganisationGatewayIdentifier;
    rorId?: ResearchOrganizationRegistryIdentifier;
    [k: string]: unknown;
}
export interface Name {
    [k: string]: unknown;
}
export interface Coverage1 {
    spatial?: GeographicCoverage;
    pathway?: Pathway;
    followUp?: Followup;
    typicalAgeRange?: AgeRange;
    datasetCompleteness?: DatasetCoverageCompletenessQuality;
    [k: string]: unknown;
}
export interface Provenance1 {
    origin?: Origin | null;
    temporal: Temporal;
}
export interface Origin {
    purpose?: Purpose;
    source?: Source;
    collectionSituation?: CollectionSituationSetting;
    imageContrast?: ImageContrast;
}
export interface Temporal {
    startDate?: StartDate;
    endDate?: EndDate;
    timeLag: TimeLag;
    accrualPeriodicity: Periodicity;
    distributionReleaseDate?: ReleaseDate;
}
export interface Accessibility {
    usage?: Usage;
    /**
     * This section includes information about data access
     */
    access: Access;
    formatAndStandards?: FormatAndStandards;
}
export interface Usage1 {
    dataUseLimitation?: DataUseLimitation;
    dataUseRequirement?: DataUseRequirements;
    resourceCreator?: CitationRequirements;
}
export interface Access {
    accessRights?: AccessRights;
    accessService?: AccessService;
    accessRequestCost?: OrganisationAccessRequestCost;
    deliveryLeadTime?: AccessRequestDuration;
    jurisdiction?: Jurisdiction;
    dataController?: DataController;
    dataProcessor?: DataProcessor;
    accessServiceCategory?: AccessGovernanceRequirements;
}
export interface FormatAndStandards1 {
    vocabularyEncodingSchemes?: ControlledVocabulary;
    conformsTo?: ConformsTo;
    languages?: LanguageCodeS;
    formats?: DatasetFormat;
}
export interface Linkage1 {
    isGeneratedUsing?: IsGeneratedUsing;
    associatedMedia?: AssociatedMedia;
    dataUses?: DataUses;
    isReferenceIn?: IsReferenceIn;
    tools?: Tools;
    datasetLinkage?: DatasetLinkage;
    investigations?: Investigations;
    syntheticDataWebLink?: SyntheticDataWebLinks;
    publicationAboutDataset?: PublicationAboutTheDataset;
    publicationUsingDataset?: PublicationUsingTheDataset;
}
export interface DatasetLinkage1 {
    isDerivedFrom?: Derivations;
    isPartOf?: IsPartOf;
    linkedDatasets?: LinkedDatasets;
    isMemberOf?: IsMemberOf;
}
export interface DatasetDescriptor {
    pid?: PersistentIdentifierOfADataset;
    title?: TitleOfADataset;
    url?: UrlOfADataset;
    [k: string]: unknown;
}
export interface Observation {
    observedNode: StatisticalPopulation;
    measuredValue: MeasuredValue;
    disambiguatingDescription?: DisambiguatingDescription;
    observationDate: ObservationDate;
    measuredProperty: MeasuredProperty;
}
export interface MeasuredProperty1 {
    [k: string]: unknown;
}
export interface DataTable {
    name?: TableName;
    description?: TableDescription;
    columns: DataColumns;
}
export interface DataColumn {
    name: ColumnName;
    dataType: ColumnName1;
    description?: ColumnDescription;
    sensitive: Sensitive;
    values?: Values;
    [k: string]: unknown;
}
export interface DataValue {
    name: ValueName;
    description?: ValueDescription;
    frequency?: ValueFrequency;
    [k: string]: unknown;
}
export interface TissuesSampleCollection {
    id?: ID;
    dataCategories?: DataCategories;
    materialType?: MaterialType;
    accessConditions?: AccessConditions;
    collectionType?: CollectionType;
    disease?: Disease;
    storageTemperature?: StorageTemperature;
    sampleAgeRange?: SampleAgeRange;
    tissueSampleMetadata?: TissueSampleMetadata;
    [k: string]: unknown;
}
export interface TissueSampleMetadata1 {
    id?: MetadataID;
    sampleDonor?: SampleDonor;
    sampleType?: SampleType;
    storageTemperature?: StorageTemperature1;
    creationDate?: CreationDate;
    anatomicalSiteOntologyCode?: AnatomicalSiteOntologyCode;
    anatomicalSiteOntologyDescription?: AnatomicalSiteOntologyDescription;
    anatomicalSiteFreeText?: AnatomicalSiteFreeText;
    sampleContentDiagnosis?: SampleContentDiagnosis;
    useRestrictions?: UseRestrictions;
    [k: string]: unknown;
}
export interface SampleDonor1 {
    id?: DonorID;
    sex?: DonorSex;
    birthDate?: DonorBirthDate;
    dataCategories?: DonorDataCategories;
    [k: string]: unknown;
}
export interface DemographicFrequency1 {
    age?: Age;
    ethnicity?: Ethnicity;
    disease?: Disease1;
}
export interface Age1 {
    bin: AgeBin;
    count: AgeCount;
    [k: string]: unknown;
}
export interface Ethnicity1 {
    bin: EthnicityBin;
    count: EthnicityCount;
    [k: string]: unknown;
}
export interface Disease2 {
    diseaseCode: DiseaseCode;
    diseaseCodeVocabulary: DiseaseCodeVocabulary;
    count: DiseaseCount;
    [k: string]: unknown;
}
export interface Omics1 {
    assay?: OmicsAssay;
    platform?: OmicsPlatform;
}
export interface ProjectGrant {
    pid?: PersistentIdentifierOfTheStudy;
    projectGrantName: ProjectGrantTitle;
    leadResearcher: LeadResearcher;
    leadResearchInstitute: LeadResearchInstitute;
    grantNumber: GrantNumberS;
    projectGrantStartDate: ProjectStartDate;
    projectGrantEndDate: ProjectEndDate;
    projectGrantScope?: ProjectScope;
    [k: string]: unknown;
}
export interface DatasetFilter {
    id: Id;
    label: Label;
    category: Category;
    primaryGroup: PrimaryGroup;
    description: Description1;
}
export interface Image {
    image?: Image1;
    description?: Description2 | null;
}
