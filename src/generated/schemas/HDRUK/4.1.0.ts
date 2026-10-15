/* eslint-disable */
/**
 * AUTO-GENERATED from HDRUK/schemata-2 (master):
 * hdr_schemata/models/HDRUK/4.1.0/schema.json
 * via `npm run generate:schema-types`. DO NOT HAND-EDIT.
 * NOTE: json-schema-to-typescript suffixes duplicate $defs titles (e.g.
 * Documentation1, Coverage1) when the same title appears on multiple schema
 * nodes - this is cosmetic.
 */

/**
 * System dataset identifier.
 */
export type DatasetIdentifier = Uuidv4 | Url | null;
export type Uuidv4 = string;
export type Url = string | null;
/**
 * Dataset metadata version.
 */
export type DatasetVersion = Semver;
export type Semver = string;
/**
 * Version number used for previous version of this dataset
 */
export type RevisionVersion = Semver;
/**
 * Some url with a reference to the record of a previous version of this dataset
 */
export type RevisionUrl = Url | null;
/**
 * A list of persistent identifiers and version numbers for previous versions of metadata for this dataset
 */
export type MetadataVersionRevisions = Revision[];
/**
 * Datetime stamp of when this metadata version was initially issued
 */
export type MetadataIssuedDatetime = string;
/**
 * Datetime stamp of when this metadata was last modified
 */
export type LastModifiedDatetime = string;
/**
 * Title of the dataset limited to 150 characters. It should provide a short description of the dataset and be unique across the gateway. If your title is not unique, please add a prefix with your organisation name or identifier to differentiate it from other datasets within the Gateway. Good titles should summarise the content of the dataset and if relevant, the region the dataset covers.
 */
export type Title = OneHundredFiftyCharacters;
export type OneHundredFiftyCharacters = string;
/**
 * Provide a clear and brief descriptive signpost for researchers who are searching for data that may be relevant to their research. The abstract should allow the reader to determine the scope of the data collection and accurately summarise its content. The optimal length is one paragraph (limited to 255 characters) and effective abstracts should avoid long sentences and abbreviations where possible.
 */
export type DatasetAbstract = AbstractText;
export type AbstractText = string | null;
/**
 * This is the organisation responsible for running or supporting the data access request process, as well as enquiries about a dataset. In most this will be the same as the HDR UK Organisation (Hub or Alliance Member). However, in some cases this will be different i.e. Tissue Directory are an HDR UK Gateway organisation but coordinate activities across a number of data publishers i.e. Cambridge Blood and Stem Cell Biobank.
 */
export type DatasetCustodian = Organisation;
/**
 * Please provide a Research Organization Registry (ROR) identifier (see https://ror.org/) for your organisation.
 */
export type Identifier = string | number;
/**
 * The organisation responsible for running or supporting the data access request process, as well as publishing and maintaining the metadata.
 */
export type NameOfDataCustodian = OneHundredFiftyCharacters;
/**
 * Please provide a logo associated with the Gateway Organisation using a valid URL. The following formats will be accepted .jpg, .png or .svg.  If a logo is not submitted this will default to the logo for the team submitting the metadata.
 */
export type OrganisationLogo = Url | null;
/**
 * Please provide a URL that describes the organisation.  If a description is not provided this will default to the description of the team submitting the metadata.
 */
export type OrganisationDescription = Description | null;
export type Description = string | null;
/**
 * Organisation contact point(s) which will be used for receiving queries from HDR, and enquiries and data access requests from Researchers.  If a contact point is not provided this will default to the contact point for the team submitting the metadata.
 */
export type ContactPoint = EmailAddress | EmailAddress[];
export type EmailAddress = string | null;
/**
 * Please indicate if the organisation is an Alliance Member or a Hub.  If this field is not submitted this will default to the membership for the team submitting the metadata.
 */
export type OrganisationMembership = MemberOfV2 | null;
export type MemberOfV2 = "Hub" | "Alliance" | "Other" | "NCS";
/**
 * Input the number of people captured within the dataset.
 */
export type DatasetPopulationSize = number;
/**
 * Please provide a list of relevant and specific keywords that can improve the search engine optimisation (SEO) of your dataset as a comma separated list. Notes: Onboarding portal will suggest keywords based on title, abstract and description. We are compiling a standardised list of keywords and synonyms across datasets to make filtering easier for users.
 */
export type Keywords = OneHundredFiftyCharacters[] | null;
/**
 * DOI associated to this dataset. Find out more about DOIs here: [https://www.doi.org/the-identifier/what-is-a-doi/](https://www.doi.org/the-identifier/what-is-a-doi/)
 */
export type DigitalObjectIdentifierDOIForDataset = Doi | null;
export type Doi = string | null;
/**
 * Please provide a valid email address that can be used to coordinate data access requests.
 */
export type ContactPoint1 = EmailAddress;
/**
 * Dataset & BioSample alias or alternate names.
 */
export type DatasetBioSampleAlias = CommaSeparatedValues | (ShortDescription | null)[] | null;
export type CommaSeparatedValues = string | null;
export type ShortDescription = string | null;
/**
 * Documentation can include a rich text description of the dataset or links to media such as documents, images, presentations, videos or links to data dictionaries, profiles or dashboards. Organisations are required to confirm that they have permission to distribute any additional media.
 */
export type Documentation = Documentation1 | null;
/**
 * Please provide any media associated with the Gateway Organisation using a valid URL for the content. This is an opportunity to provide additional context that could be useful for researchers wanting to understand more about the dataset and its relevance to their research question. The following formats will be accepted .jpg, .png or .svg, .pdf, .xslx or .docx. Note: media asset can be hosted by the organisation or uploaded using the onboarding portal.
 */
export type AssociatedMedia = CommaSeparatedValues | (Url | null)[] | null;
/**
 * Indicate whether this dataset is currently available for Researchers to request access.
 */
export type DatasetPipelineStatus = Pipeline | null;
export type Pipeline = "Available" | "Not available";
/**
 * This information includes attributes for geographical and temporal coverage, cohort details etc. to enable a deeper understanding of the dataset content so that researchers can make decisions about the relevance of the underlying data.
 */
export type Coverage = Coverage1 | null;
/**
 * The geographical area covered by the dataset. It is recommended that links are to entries in one of the recommended standards:\n- For locations in the UK: [ONS standards](https://geoportal.statistics.gov.uk/datasets/208d9884575647c29f0dd5a1184e711a/about)\n- For locations in other countries: [ISO 3166-1 & ISO 3166-2](https://github.com/HDRUK/reference-codes)
 */
export type GeographicCoverage = CommaSeparatedValues | Url[];
/**
 * Please indicate the minimum age in years of participants in the dataset as a whole number (integer).
 */
export type MinimumAgeRange = number | null;
/**
 * Please indicate the maximum age in years of participants in the dataset as a whole number (integer).
 */
export type MaximumAgeRange = number | null;
/**
 * The URL where a Researcher can learn more about the completeness of the dataset.
 */
export type DatasetCoverageCompletenessQuality = Url | null;
/**
 * The type of biospecimen saved from a biological entity.
 */
export type BiologicalSampleAvailability = MaterialTypeCategoriesV2[] | null;
export type MaterialTypeCategoriesV2 =
  | "None/not available"
  | "Bone marrow"
  | "Cancer cell lines"
  | "CDNA/MRNA"
  | "Core biopsy"
  | "DNA"
  | "Entire body organ"
  | "Faeces"
  | "Immortalized cell lines"
  | "Isolated pathogen"
  | "MicroRNA"
  | "Peripheral blood cells"
  | "Plasma"
  | "PM Tissue"
  | "Primary cells"
  | "RNA"
  | "Saliva"
  | "Serum"
  | "Swabs"
  | "Tissue"
  | "Urine"
  | "Whole blood"
  | "Availability to be confirmed"
  | "Other";
/**
 * If known, what is the typical time span that a patient appears in the dataset (follow up period). In a prospective cohort study, after baseline information is collected, participants are followed “longitudinally” i.e. new information is collected about them for a period of time afterward. This is known as the “follow up period”. What is the typical time span of follow up, e.g. 1 year, 5 years? If there are multiple cohorts in the dataset with varying follow up periods, please provide the longest follow up period.
 */
export type FollowUp = FollowupV2 | null;
export type FollowupV2 =
  "0 - 6 Months" | "6 - 12 Months" | "1 - 10 Years" | "> 10 Years" | "Unknown" | "Continuous" | "Other" | null;
/**
 * Please indicate if the dataset is representative of the patient pathway and any limitations the dataset may have with respect to pathway coverage. This could include if the dataset is from a single speciality or area, a single tier of care, linked across two tiers (e.g. primary and secondary care), or an integrated care record covering the whole patient pathway.
 */
export type PatientPathwayDescription = Description | null;
/**
 * Provenance information allows researchers to understand data within the context of its origins and can be an indicator of quality, authenticity and timeliness.
 */
export type Provenance = Provenance1 | null;
/**
 * Coverage by origin (geographical and situations).
 */
export type OriginCoverage = Origin | null;
/**
 * Please indicate the purpose(s) that the dataset was collected.
 */
export type PurposeOfDatasetCollection = PurposeV2[] | null;
export type PurposeV2 =
  | "Research cohort"
  | "Study"
  | "Disease registry"
  | "Trial"
  | "Care"
  | "Audit"
  | "Administrative"
  | "Financial"
  | "Statutory"
  | "Other"
  | null;
export type Name = string;
export type Subtypes = HealthAndDiseaseSubTypes[] | null;
export type HealthAndDiseaseSubTypes =
  | "Mental health"
  | "Cardiovascular"
  | "Cancer"
  | "Rare diseases"
  | "Metabolic and endocrine"
  | "Neurological"
  | "Reproductive"
  | "Maternity and neonatology"
  | "Respiratory"
  | "Immunity"
  | "Musculoskeletal"
  | "Vision"
  | "Renal and urogenital"
  | "Oral and gastrointestinal"
  | "Cognitive function"
  | "Hearing"
  | "Others";
export type Name1 = string;
export type Subtypes1 = TreatmentsInterventionsSubTypes[] | null;
export type TreatmentsInterventionsSubTypes = "Vaccines" | "Preventive" | "Therapeutic" | "Others";
export type Name2 = string;
export type Subtypes2 = MeasurementsTestsSubTypes[] | null;
export type MeasurementsTestsSubTypes = "Laboratory" | "Other diagnostics";
export type Name3 = string;
export type Subtypes3 = ImagingTypesSubTypes[] | null;
export type ImagingTypesSubTypes = "CT" | "MRI" | "PET" | "X-ray" | "Ultrasound" | "Pathology" | "Others";
export type Name4 = string;
export type Subtypes4 = ImagingAreaOfTheBodySubTypes[] | null;
export type ImagingAreaOfTheBodySubTypes = "Head" | "Chest" | "Arm" | "Abdomen" | "Leg" | "Others";
export type Name5 = string;
export type Subtypes5 = OmicsDataTypeSubTypes[] | null;
export type OmicsDataTypeSubTypes =
  | "Proteomics"
  | "Transcriptomics"
  | "Epigenomics"
  | "Metabolomics"
  | "Metagenomics"
  | "Genomics"
  | "Lipidomics"
  | "Others";
export type Name6 = string;
export type Subtypes6 = SocioeconomicSubTypes[] | null;
export type SocioeconomicSubTypes =
  | "Education"
  | "Crime and justice"
  | "Ethnicity"
  | "Housing"
  | "Labour"
  | "Ageing"
  | "Economics"
  | "Marital status"
  | "Social support"
  | "Deprivation"
  | "Religion"
  | "Occupation"
  | "Finances"
  | "Family circumstance"
  | "Others";
export type Name7 = string;
export type Subtypes7 = LifestyleSubTypes[] | null;
export type LifestyleSubTypes = "Smoking" | "Physical activity" | "Dietary habits" | "Alcohol" | "Others";
export type Name8 = string;
export type Subtypes8 = RegistrySubTypes[] | null;
export type RegistrySubTypes =
  "Disease registry (research)" | "National disease registries and audits" | "Births and deaths" | "Others";
export type Name9 = string;
export type Subtypes9 = NotApplicableSubTypes[] | null;
export type NotApplicableSubTypes = "Not applicable";
export type Name10 = string;
export type Subtypes10 = NotApplicableSubTypes[] | null;
export type Name11 = string;
export type Subtypes11 = NotApplicableSubTypes[] | null;
/**
 * The topic areas to which the dataset content relates.
 */
export type DatasetType = (
  | HealthAndDisease
  | TreatmentsInterventions
  | MeasurementsTests
  | ImagingTypes
  | ImagingAreaOfTheBody
  | OmicsDataType
  | Socioeconomic
  | Lifestyle
  | Registry
  | EnvironmentAndEnergy
  | InformationAndCommunication
  | Politics
)[];
/**
 * Please indicate the source of the data extraction.
 */
export type SourceOfDataExtraction = SourceV2[] | null;
export type SourceV2 =
  "EPR" | "Electronic survey" | "LIMS" | "Paper-based" | "Free text NLP" | "Machine generated" | "Other";
/**
 * Please indicate the setting(s) where data was collected. Multiple settings may be provided.
 */
export type CollectionSourceSetting = SettingV2[] | null;
export type SettingV2 =
  | "Cohort, study, trial"
  | "Clinic"
  | "Primary care - Referrals"
  | "Primary care - Clinic"
  | "Primary care - Out of hours"
  | "Secondary care - Accident and Emergency"
  | "Secondary care - Outpatients"
  | "Secondary care - In-patients"
  | "Secondary care - Ambulance"
  | "Secondary care - ICU"
  | "Prescribing - Community pharmacy"
  | "Prescribing - Hospital"
  | "Patient report outcome"
  | "Wearables"
  | "Local authority"
  | "National government"
  | "Community"
  | "Services"
  | "Home"
  | "Private"
  | "Social care - Health care at home"
  | "Social care - Other social data"
  | "Census"
  | "Other"
  | null;
/**
 * Indicate whether usage of imaging contrast is captured within the dataset.
 */
export type ImageContrast = Ternary | null;
export type Ternary = "Yes" | "No" | "Not stated";
/**
 * Dates and other temporal coverage information.
 */
export type TemporalCoverage = Temporal;
/**
 * Please indicate the frequency of distribution release. If a dataset is distributed regularly please choose a distribution release periodicity from the constrained list and indicate the next release date. When the release date becomes historical, a new release date will be calculated based on the publishing periodicity. If a dataset has been published and will remain static please indicate that it is static and indicated when it was released. If a dataset is released on an irregular basis or “on-demand” please indicate that it is Irregular and leave release date as null. If a dataset can be published in real-time or near-real-time please indicate that it is continuous and leave release date as null. Notes: see https://www.dublincore.org/specifications/dublin-core/collection-description/frequency/
 */
export type PublishingFrequency = PeriodicityV2;
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
export type DistributionReleaseDate = string | null;
/**
 * The start of the time period that the dataset provides coverage for. If there are multiple cohorts in the dataset with varying start dates, please provide the earliest date and use the description or the media attribute to provide more information.
 */
export type StartDate = string;
/**
 * The end of the time period that the dataset provides coverage for. If the dataset is “Continuous” and has no known end date, please state continuous. If there are multiple cohorts in the dataset with varying end dates, please provide the latest date and use the description or the media attribute to provide more information.
 */
export type EndDate = string | EndDateEnum | null;
export type EndDateEnum = "CONTINUOUS" | null;
/**
 * Please indicate the typical time-lag between an event and the data for that event appearing in the dataset.
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
 * This section includes information about how the data can be used and how it is currently being used.
 */
export type Usage = Usage1 | null;
/**
 * Please provide an indication of consent permissions for datasets and/or materials, and relates to the purposes for which datasets and/or material might be removed, stored or used. NOTE: we have extended the Data Use Ontology to include a value for NO LINKAGE.
 */
export type DataUseLimitation = DataUseLimitationV2[] | null;
export type DataUseLimitationV2 =
  | "General research use"
  | "Commercial research use"
  | "Genetic studies only"
  | "No general methods research"
  | "No restriction"
  | "Geographical restrictions"
  | "Institution-specific restrictions"
  | "Not for profit use"
  | "Project-specific restrictions"
  | "Research-specific restrictions"
  | "User-specific restrictions"
  | "Research use only"
  | "No linkage";
/**
 * Please indicate fit here are any additional conditions set for use if any, multiple requirements may be provided. Please ensure that these restrictions are documented in access rights information.
 */
export type DataUseRequirements = DataUseRequirementsV2[] | null;
export type DataUseRequirementsV2 =
  | "Collaboration required"
  | "Project-specific restrictions"
  | "Ethics approval required"
  | "Institution-specific restrictions"
  | "Geographical restrictions"
  | "Publication moratorium"
  | "Publication required"
  | "Return to database or resource"
  | "Time limit on use"
  | "Disclosure control"
  | "Not for profit use"
  | "User-specific restriction";
/**
 * Please provide the text that you would like included as part of any citation that credits this dataset. This is typically just the name of the publisher.   No employee details should be provided.
 */
export type CitationRequirements = ShortDescription | (ShortDescription | null)[] | null;
/**
 * Permissions relating to how people and materials within this dataset may be used, beyond the general access and use conditions described elsewhere in this section.
 */
export type DataUsePermissions = DataUsePermissions1 | null;
/**
 * Indicates whether the people from whom the dataset is generated can be recontacted as part of a follow-up or new study.
 */
export type PatientRecontact = YesNo | null;
export type YesNo = "Yes" | "No";
/**
 * Machine-readable codes from the GA4GH Data Use Ontology describing the permitted or restricted uses of this dataset, for interoperability with other GA4GH-compliant systems.
 */
export type GA4GHDataUseOntologyDUOCodes = DuoCodesEnum[] | null;
export type DuoCodesEnum = DuoCodesEnum1 & DuoCodesEnum2;
export type DuoCodesEnum1 =
  | DataUsePermission
  | NoRestriction
  | HealthOrMedicalOrBiomedicalResearch
  | DiseaseSpecificResearch
  | PopulationOriginsOrAncestryResearchOnly
  | ResearchSpecificRestrictions
  | NoGeneralMethodsResearch
  | GeneticStudiesOnly
  | DataUseModifier
  | NotForProfitNonCommercialUseOnly
  | PublicationRequired
  | CollaborationRequired
  | EthicsApprovalRequired
  | GeographicalRestriction
  | PublicationMoratorium
  | TimeLimitOnUse
  | UserSpecificRestriction
  | ProjectSpecificRestriction
  | InstitutionSpecificRestriction
  | ReturnToDatabaseOrResource
  | GeneralResearchUse
  | ClinicalCareUse
  | PopulationOriginsOrAncestryResearchProhibited
  | NotForProfitOrganisationUseOnly
  | NonCommercialUseOnly;
/**
 * A data item that is used to indicate consent permissions for datasets and/or materials, and relates to the purposes for which datasets and/or material might be removed, stored or used.
 */
export type DataUsePermission = "DUO:0000001";
/**
 * This data use permission indicates there is no restriction on use.
 */
export type NoRestriction = "DUO:0000004";
/**
 * This data use permission indicates that use is allowed for health/medical/biomedical purposes; does not include the study of population origins or ancestry.
 */
export type HealthOrMedicalOrBiomedicalResearch = "DUO:0000006";
/**
 * This data use permission indicates that use is allowed provided it is related to the specified disease.
 */
export type DiseaseSpecificResearch = "DUO:0000007";
/**
 * This data use permission indicates that use of the data is limited to the study of population origins or ancestry.
 */
export type PopulationOriginsOrAncestryResearchOnly = "DUO:0000011";
/**
 * This data use modifier indicates that use is limited to studies of a certain research type.
 */
export type ResearchSpecificRestrictions = "DUO:0000012";
/**
 * This data use modifier indicates that use does not allow methods development research (e.g., development of software or algorithms).
 */
export type NoGeneralMethodsResearch = "DUO:0000015";
/**
 * This data use modifier indicates that use is limited to genetic studies only (i.e., studies that include genotype research alone or both genotype and phenotype research, but not phenotype research exclusively)
 */
export type GeneticStudiesOnly = "DUO:0000016";
/**
 * Data use modifiers indicate additional conditions for use.
 */
export type DataUseModifier = "DUO:0000017";
/**
 * This data use modifier indicates that use of the data is limited to not-for-profit organizations and not-for-profit use, non-commercial use.
 */
export type NotForProfitNonCommercialUseOnly = "DUO:0000018";
/**
 * This data use modifier indicates that requestor agrees to make results of studies using the data available to the larger scientific community.
 */
export type PublicationRequired = "DUO:0000019";
/**
 * This data use modifier indicates that the requestor must agree to collaboration with the primary study investigator(s).
 */
export type CollaborationRequired = "DUO:0000020";
/**
 * This data use modifier indicates that the requestor must provide documentation of local IRB/ERB approval.
 */
export type EthicsApprovalRequired = "DUO:0000021";
/**
 * This data use modifier indicates that use is limited to within a specific geographic region.
 */
export type GeographicalRestriction = "DUO:0000022";
/**
 * This data use modifier indicates that requestor agrees not to publish results of studies until a specific date.
 */
export type PublicationMoratorium = "DUO:0000024";
/**
 * This data use modifier indicates that use is approved for a specific number of months.
 */
export type TimeLimitOnUse = "DUO:0000025";
/**
 * This data use modifier indicates that use is limited to use by approved users.
 */
export type UserSpecificRestriction = "DUO:0000026";
/**
 * This data use modifier indicates that use is limited to use within an approved project.
 */
export type ProjectSpecificRestriction = "DUO:0000027";
/**
 * This data use modifier indicates that use is limited to use within an approved institution.
 */
export type InstitutionSpecificRestriction = "DUO:0000028";
/**
 * This data use modifier indicates that the requestor must return derived/enriched data to the database/resource.
 */
export type ReturnToDatabaseOrResource = "DUO:0000029";
/**
 * This data use permission indicates that use is allowed for general research use for any research purpose.
 */
export type GeneralResearchUse = "DUO:0000042";
/**
 * This data use modifier indicates that use is allowed for clinical use and care.
 */
export type ClinicalCareUse = "DUO:0000043";
/**
 * This data use modifier indicates use for purposes of population, origin, or ancestry research is prohibited.
 */
export type PopulationOriginsOrAncestryResearchProhibited = "DUO:0000044";
/**
 * This data use modifier indicates that use of the data is limited to not-for-profit organizations.
 */
export type NotForProfitOrganisationUseOnly = "DUO:0000045";
/**
 * This data use modifier indicates that use of the data is limited to not-for-profit use.
 */
export type NonCommercialUseOnly = "DUO:0000046";
export type DuoCodesEnum2 = string;
/**
 * Accessibility information allows researchers to understand access, usage, limitations, formats, standards and linkage or interoperability with toolsets.
 */
export type Accessibility1 = Access;
/**
 * Please provide details for the data access rights.
 */
export type AccessRights = LongDescription;
export type LongDescription = string | null;
/**
 * The method a Researcher will use to access the dataset, if approved.
 */
export type AccessMethodCategory = AccessService | null;
export type AccessService = "TRE/SDE" | "Direct access" | "Open access" | "Varies based on project";
/**
 * Please provide a brief description of the data access services that are available including: environment that is currently available to researchers; additional consultancy and services; any indication of costs associated. If no environment is currently available, please indicate the current plans and timelines when and how data will be made available to researchers Note: This value will be used as default access environment for all datasets submitted by the organisation. However, there will be the opportunity to overwrite this value for each dataset.
 */
export type AccessServiceDescription = LongDescription | null;
/**
 * Please provide link(s) to a webpage or description detailing the service or cost model for processing data access requests.
 */
export type AccessRequestCost = LongDescription | null;
/**
 * Please provide an indication of the typical processing times based on the types of requests typically received.
 */
export type TimeToDatasetAccess = DeliveryLeadTimeV2 | null;
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
export type Jurisdiction = Isocountrycode[] | null;
export type Isocountrycode = string;
/**
 * Data Controller means a person/entity who (either alone or jointly or in common with other persons/entities) determines the purposes for which and the way any Data Subject data, specifically personal data or are to be processed.
 */
export type DataController = LongDescription | null;
/**
 * A Data Processor, in relation to any Data Subject data, specifically personal data, means any person/entity (other than an employee of the data controller) who processes the data on behalf of the data controller.
 */
export type DataProcessor = LongDescription | null;
/**
 * Section includes technical attributes for language vocabularies, sizes etc. and gives researchers facts about and processing the underlying data in the dataset.
 */
export type FormatAndStandards = FormatAndStandards1 | null;
export type ControlledVocabularyEnum =
  | "LOCAL"
  | "OPCS4"
  | "READ"
  | "SNOMED CT"
  | "SNOMED RT"
  | "DM PLUS D"
  | "DM+D"
  | "NHS NATIONAL CODES"
  | "NHS SCOTLAND NATIONAL CODES"
  | "NHS WALES NATIONAL CODES"
  | "ODS"
  | "LOINC"
  | "ICD10"
  | "ICD10CM"
  | "ICD10PCS"
  | "ICD9CM"
  | "ICD9"
  | "ICDO3"
  | "AMT"
  | "APC"
  | "ATC"
  | "CIEL"
  | "HPO"
  | "CPT4"
  | "DPD"
  | "DRG"
  | "HEMONC"
  | "JMDC"
  | "KCD7"
  | "MULTUM"
  | "NAACCR"
  | "NDC"
  | "NDFRT"
  | "OXMIS"
  | "RXNORM"
  | "RXNORM EXTENSION"
  | "SPL"
  | "OTHER";
/**
 * List any relevant terminologies / ontologies / controlled vocabularies, such as ICD 10 Codes, NHS Data Dictionary National Codes or SNOMED CT International, that are being used by the dataset. If the controlled vocabularies are local standards, please make that explicit. If you are using a standard that has not been included in the list, please use “other” and contact support desk to ask for an addition. Notes: More than one vocabulary may be provided.
 */
export type ControlledVocabulary = ControlledVocabularyEnum[];
export type StandardisedDataModelsEnumV2 =
  | "HL7 FHIR"
  | "HL7 V2"
  | "HL7 CDA"
  | "HL7 CCOW"
  | "LOINC"
  | "DICOM"
  | "I2B2"
  | "IHE"
  | "OMOP"
  | "OPENEHR"
  | "SENTINEL"
  | "PCORNET"
  | "CDISC"
  | "NHS DATA DICTIONARY"
  | "NHS SCOTLAND DATA DICTIONARY"
  | "NHS WALES DATA DICTIONARY"
  | "LOCAL"
  | "OTHER"
  | "BNF"
  | "DDI"
  | "DCAT";
/**
 * List standardised data models that the dataset has been stored in or transformed to, such as OMOP or FHIR. If the data is only available in a local format, please make that explicit. If you are using a standard that has not been included in the list, please use “other” and contact support desk to ask for an addition.
 */
export type AlignmentWithStandardisedDataModels = StandardisedDataModelsEnumV2[];
export type LanguageEnum =
  | "aa"
  | "ab"
  | "ae"
  | "af"
  | "ak"
  | "am"
  | "an"
  | "ar"
  | "as"
  | "av"
  | "ay"
  | "az"
  | "ba"
  | "be"
  | "bg"
  | "bh"
  | "bi"
  | "bm"
  | "bn"
  | "bo"
  | "br"
  | "bs"
  | "ca"
  | "ce"
  | "ch"
  | "co"
  | "cr"
  | "cs"
  | "cu"
  | "cv"
  | "cy"
  | "da"
  | "de"
  | "dv"
  | "dz"
  | "ee"
  | "el"
  | "en"
  | "eo"
  | "es"
  | "et"
  | "eu"
  | "fa"
  | "ff"
  | "fi"
  | "fj"
  | "fo"
  | "fr"
  | "fy"
  | "ga"
  | "gd"
  | "gl"
  | "gn"
  | "gu"
  | "gv"
  | "ha"
  | "he"
  | "hi"
  | "ho"
  | "hr"
  | "ht"
  | "hu"
  | "hy"
  | "hz"
  | "ia"
  | "id"
  | "ie"
  | "ig"
  | "ii"
  | "ik"
  | "io"
  | "is"
  | "it"
  | "iu"
  | "ja"
  | "jv"
  | "ka"
  | "kg"
  | "ki"
  | "kj"
  | "kk"
  | "kl"
  | "km"
  | "kn"
  | "ko"
  | "kr"
  | "ks"
  | "ku"
  | "kv"
  | "kw"
  | "ky"
  | "la"
  | "lb"
  | "lg"
  | "li"
  | "ln"
  | "lo"
  | "lt"
  | "lu"
  | "lv"
  | "mg"
  | "mh"
  | "mi"
  | "mk"
  | "ml"
  | "mn"
  | "mr"
  | "ms"
  | "mt"
  | "my"
  | "na"
  | "nb"
  | "nd"
  | "ne"
  | "ng"
  | "nl"
  | "nn"
  | "no"
  | "nr"
  | "nv"
  | "ny"
  | "oc"
  | "oj"
  | "om"
  | "or"
  | "os"
  | "pa"
  | "pi"
  | "pl"
  | "ps"
  | "pt"
  | "qu"
  | "rm"
  | "rn"
  | "ro"
  | "ru"
  | "rw"
  | "sa"
  | "sc"
  | "sd"
  | "se"
  | "sg"
  | "si"
  | "sk"
  | "sl"
  | "sm"
  | "sn"
  | "so"
  | "sq"
  | "sr"
  | "ss"
  | "st"
  | "su"
  | "sv"
  | "sw"
  | "ta"
  | "te"
  | "tg"
  | "th"
  | "ti"
  | "tk"
  | "tl"
  | "tn"
  | "to"
  | "tr"
  | "ts"
  | "tt"
  | "tw"
  | "ty"
  | "ug"
  | "uk"
  | "ur"
  | "uz"
  | "ve"
  | "vi"
  | "vo"
  | "wa"
  | "wo"
  | "xh"
  | "yi"
  | "yo"
  | "za"
  | "zh"
  | "zu";
/**
 * This should list all the languages in which the dataset metadata and underlying data is made available complaint with ISO 639.
 */
export type Language = LanguageEnum[];
export type Format1 = string;
/**
 * If multiple formats are available please specify. See application, audio, image, message, model, multipart, text, video, https://www.iana.org/assignments/media-types/media-types.xhtml Note: If your file format is not included in the current list of formats, please indicate other. If you are using the HOP you will be directed to a service desk page where you can request your additional format. If not please go to: https://metadata.atlassian.net/servicedesk/customer/portal/4 to request your format.
 */
export type Format = Format1[];
/**
 * This section includes information about related datasets that may have previously been linked, as well as indicating if there is the opportunity to link to other datasets in the future. If a dataset has been enriched and/or derivations, scores and existing tools are available this section allows providers to indicate this to researchers.
 */
export type EnrichmentAndLinkage = EnrichmentAndLinkage1 | null;
/**
 * If applicable, please provide DOIs or links to datasets from which data in this dataset has been derived or calculated from.
 */
export type DerivedFrom = DatasetDescriptor[] | null;
export type PersistentIdentifierOfADataset = OneHundredFiftyCharacters | null;
export type TitleOfADataset = OneHundredFiftyCharacters | null;
export type UrlOfADataset = Url | null;
/**
 * This relationship indicates that the dataset is a component or subset of a broader collection of related datasets. For example, clinical trial data for a specific drug may be part of a larger database of pharmaceutical research data. Complete only if the dataset is part of a group or family of datasets i.e. Hospital Episode Statistics has several constituents. If your dataset is not part of a group, please enter “NOT APPLICABLE” **Example**: Hospital Episodes Statistics datasets (A&E, APC, OP, AC MSDS).
 */
export type IsPartOf = DatasetDescriptor[] | null;
/**
 * If applicable, please provide the DOI of other datasets that have previously been linked to this dataset and their availability. If no DOI is available, please provide the title of the datasets that can be linked.
 */
export type LinkedDatasets = DatasetDescriptor[] | null;
/**
 * Datasets that are similar to each other in some way, collect similar patients, regional equivalent etc.
 */
export type SimilarToDatasets = DatasetDescriptor[] | null;
/**
 * Please provide link to any active projects that are using the dataset.
 */
export type Investigations = Url[] | null;
/**
 * Please provide the URL of any analysis tools or models that have been created for this dataset and are available for further use. Multiple tools may be provided. Note: We encourage users to adopt a model along the lines of https://www.ga4gh.org/news/tool-registry-service-api-enabling-an-interoperable-library-of-genomics-analysis-tools/
 */
export type Tools = Url[] | null;
/**
 * DOIs for publications which describe the dataset.
 */
export type PublicationAboutTheDataset = Doi[] | null;
/**
 * DOIs for publications which use the dataset for analysis.
 */
export type PublicationUsingTheDataset = Doi[] | null;
/**
 * Please select one of the following broad notes for your measured observation. Indicating whether the measured property is a recording of unique persons, events, findings or scans per modality.
 */
export type DatasetVolumeMeasure = StatisticalPopulationConstrainedV2;
export type StatisticalPopulationConstrainedV2 = "Persons" | "Events" | "Findings" | "Number of scans per modality";
/**
 * An integer value size of the measured property, such as ‘1000’ for 1000 people in the study or ‘87’ for 87 MRI scans in the dataset.
 */
export type MeasuredValue = number;
/**
 * If required, please provide additional details that help distinguish between similar measured properties within your dataset, for example this is useful when SNOMED CT terms do not provide sufficient detail to distinguish between parts of the dataset population. Limited to 500 characters.
 */
export type DisambiguatingDescription = AbstractText | null;
/**
 * Provide the date, or datetime that the observation was made. Multiple observations of the same property can be provided, for example an observation of cumulative COVID positive cases by specimen on the 1/1/2021 with a measuredValue of 2000000, and a second observation entry on 8/2/2021 recording a measuredValue of as 3100000.
 */
export type ObservationDate = string;
/**
 * Descriptive term for the observation property measured. For example, people, procedures, x-rays, or diagnosis of type 1 diabetes. This could also be a specific SNOMED CT term.
 */
export type MeasuredProperty = MeasuredProperty1;
/**
 * This section provides an overview of observations of your dataset linked to specific points in time. Multiple observations about the dataset are encouraged to be provided, including multiple observations of the same property at different timepoints. At least one observation is required.
 */
export type Observations = Observation[];
/**
 * Descriptions of all tables and data elements that can be included in the dataset.
 */
export type StructuralMetadata = StructuralMetadata1 | null;
/**
 * Tables in the dataset
 */
export type Tables = DataTable[] | null;
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
export type ColumnName = Name12;
/**
 * The data type of values in the column.
 */
export type DataType = string;
/**
 * A description of a column in a table.
 */
export type ColumnDescription = string | null;
/**
 * A True or False value, indicating if the field is sensitive or not.
 */
export type Sensitive = boolean;
/**
 * Values in a dataset.
 */
export type Values = DataValue[] | null;
/**
 * Unique value in a column.
 */
export type ValueName = Name12;
/**
 * A description of a unique value in a column.
 */
export type ValueDescription = string | null;
/**
 * The frequency of occurrance of a value in a column.
 */
export type ValueFrequency = number | null;
/**
 * A list of columns contained within a table in a dataset.
 */
export type DataColumns = DataColumn[];
/**
 * Please provide the website address(es) with information on your synthetic dataset creation, or the location where a synthetic version of the dataset can be accessed.\n- Please split your existing list of citations into separate fields.\n- To add multiple entries, select from the drop-down list, or add to the drop-down. Click the 'x' symbol to remove any entries.\n- **Example**: https://www.pioneerdatahub.co.uk/dataset/synthetic-dataset-patients-at-risk-of-sudden-death-hypertrophic-cardiomyopathy/
 */
export type SyntheticDataWebLinks = Url[] | null;
/**
 * The statistical characteristics of a population or group within the dataset.
 */
export type DemographicFrequency = DemographicFrequency1 | null;
/**
 * Array of bins, based off the UK Office for National Statistics (ONS) groupings, and their corresponding counts as represented within the dataset.
 */
export type Age = Age1[] | null;
export type AgeGrouping = AgeEnum;
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
 * Array of bins, based off the UK Office for National Statistics (ONS) census groupings, and their corresponding counts as represented within the dataset.
 */
export type Ethnicity = Ethnicity1[] | null;
export type EthnicityGrouping = EthnicityEnum;
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
 * Array of health conditions or diseases (based around ICD-10, SNOMED CT and MeSH disease vocabularies) and their corresponding counts as represented within the dataset.
 */
export type Disease = Disease1[] | null;
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
  "Other" | "NMR Nightingale" | "Metabolon" | "Biocrates" | "Illumina" | "Oxford Nanopore" | "454" | "Hi-C" | "HiFi";

export interface Hdruk410 {
  identifier: DatasetIdentifier;
  version: DatasetVersion;
  revisions: MetadataVersionRevisions;
  issued: MetadataIssuedDatetime;
  modified: LastModifiedDatetime;
  /**
   * Summary of metadata describing key pieces of information.
   */
  summary: Summary;
  documentation?: Documentation;
  coverage?: Coverage;
  provenance?: Provenance;
  /**
   * Accessibility information allows researchers to understand access, usage, limitations, formats, standards and linkage or interoperability with toolsets.
   */
  accessibility: Accessibility;
  enrichmentAndLinkage?: EnrichmentAndLinkage;
  observations: Observations;
  structuralMetadata?: StructuralMetadata;
  demographicFrequency?: DemographicFrequency;
  omics?: Omics;
}
export interface Revision {
  version: RevisionVersion;
  url?: RevisionUrl;
}
export interface Summary {
  title: Title;
  abstract: DatasetAbstract;
  dataCustodian: DatasetCustodian;
  populationSize: DatasetPopulationSize;
  keywords?: Keywords;
  doiName?: DigitalObjectIdentifierDOIForDataset;
  contactPoint: ContactPoint1;
  datasetAliases?: DatasetBioSampleAlias;
}
export interface Organisation {
  identifier: Identifier;
  name: NameOfDataCustodian;
  logo?: OrganisationLogo;
  description?: OrganisationDescription;
  contactPoint: ContactPoint;
  memberOf?: OrganisationMembership;
}
export interface Documentation1 {
  /**
   * A free-text description of the dataset.\nA URL can also be provided as the description of the dataset.\nGateway Feature: Keywords and text may be extracted out of the description and indexed for search.
   */
  description: Description;
  associatedMedia?: AssociatedMedia;
  inPipeline?: DatasetPipelineStatus;
}
export interface Coverage1 {
  spatial: GeographicCoverage;
  typicalAgeRangeMin?: MinimumAgeRange;
  typicalAgeRangeMax?: MaximumAgeRange;
  datasetCompleteness?: DatasetCoverageCompletenessQuality;
  materialType?: BiologicalSampleAvailability;
  followUp?: FollowUp;
  pathway?: PatientPathwayDescription;
}
export interface Provenance1 {
  origin?: OriginCoverage;
  temporal: TemporalCoverage;
}
export interface Origin {
  purpose?: PurposeOfDatasetCollection;
  datasetType: DatasetType;
  source?: SourceOfDataExtraction;
  collectionSource?: CollectionSourceSetting;
  imageContrast?: ImageContrast;
}
export interface HealthAndDisease {
  name?: Name;
  subTypes: Subtypes;
  [k: string]: unknown;
}
export interface TreatmentsInterventions {
  name?: Name1;
  subTypes: Subtypes1;
  [k: string]: unknown;
}
export interface MeasurementsTests {
  name?: Name2;
  subTypes: Subtypes2;
  [k: string]: unknown;
}
export interface ImagingTypes {
  name?: Name3;
  subTypes: Subtypes3;
  [k: string]: unknown;
}
export interface ImagingAreaOfTheBody {
  name?: Name4;
  subTypes: Subtypes4;
  [k: string]: unknown;
}
export interface OmicsDataType {
  name?: Name5;
  subTypes: Subtypes5;
  [k: string]: unknown;
}
export interface Socioeconomic {
  name?: Name6;
  subTypes: Subtypes6;
  [k: string]: unknown;
}
export interface Lifestyle {
  name?: Name7;
  subTypes: Subtypes7;
  [k: string]: unknown;
}
export interface Registry {
  name?: Name8;
  subTypes: Subtypes8;
  [k: string]: unknown;
}
export interface EnvironmentAndEnergy {
  name?: Name9;
  subTypes: Subtypes9;
  [k: string]: unknown;
}
export interface InformationAndCommunication {
  name?: Name10;
  subTypes: Subtypes10;
  [k: string]: unknown;
}
export interface Politics {
  name?: Name11;
  subTypes: Subtypes11;
  [k: string]: unknown;
}
export interface Temporal {
  publishingFrequency: PublishingFrequency;
  distributionReleaseDate?: DistributionReleaseDate;
  startDate: StartDate;
  endDate?: EndDate;
  timeLag: TimeLag;
}
export interface Accessibility {
  usage?: Usage;
  access: Accessibility1;
  formatAndStandards?: FormatAndStandards;
}
export interface Usage1 {
  dataUseLimitation?: DataUseLimitation;
  dataUseRequirements?: DataUseRequirements;
  resourceCreator?: CitationRequirements;
  dataUsePermissions?: DataUsePermissions;
  duoCodes?: GA4GHDataUseOntologyDUOCodes;
}
export interface DataUsePermissions1 {
  patientRecontact?: PatientRecontact;
}
export interface Access {
  accessRights: AccessRights;
  accessServiceCategory?: AccessMethodCategory;
  accessService?: AccessServiceDescription;
  accessRequestCost?: AccessRequestCost;
  deliveryLeadTime?: TimeToDatasetAccess;
  jurisdiction?: Jurisdiction;
  dataController?: DataController;
  dataProcessor?: DataProcessor;
}
export interface FormatAndStandards1 {
  vocabularyEncodingScheme: ControlledVocabulary;
  conformsTo: AlignmentWithStandardisedDataModels;
  language: Language;
  format: Format;
}
export interface EnrichmentAndLinkage1 {
  derivedFrom?: DerivedFrom;
  isPartOf?: IsPartOf;
  linkableDatasets?: LinkedDatasets;
  similarToDatasets?: SimilarToDatasets;
  investigations?: Investigations;
  tools?: Tools;
  publicationAboutDataset?: PublicationAboutTheDataset;
  publicationUsingDataset?: PublicationUsingTheDataset;
}
export interface DatasetDescriptor {
  pid?: PersistentIdentifierOfADataset;
  title?: TitleOfADataset;
  url?: UrlOfADataset;
  [k: string]: unknown;
}
export interface Observation {
  observedNode: DatasetVolumeMeasure;
  measuredValue: MeasuredValue;
  disambiguatingDescription?: DisambiguatingDescription;
  observationDate: ObservationDate;
  measuredProperty: MeasuredProperty;
}
export interface MeasuredProperty1 {
  [k: string]: unknown;
}
export interface StructuralMetadata1 {
  tables?: Tables;
  syntheticDataWebLink?: SyntheticDataWebLinks;
}
export interface DataTable {
  name?: TableName;
  description?: TableDescription;
  columns: DataColumns;
}
export interface DataColumn {
  name: ColumnName;
  dataType: DataType;
  description?: ColumnDescription;
  sensitive: Sensitive;
  values?: Values;
  [k: string]: unknown;
}
export interface Name12 {
  [k: string]: unknown;
}
export interface DataValue {
  name: ValueName;
  description?: ValueDescription;
  frequency?: ValueFrequency;
  [k: string]: unknown;
}
export interface DemographicFrequency1 {
  age?: Age;
  ethnicity?: Ethnicity;
  disease?: Disease;
}
export interface Age1 {
  bin: AgeGrouping;
  count: AgeCount;
  [k: string]: unknown;
}
export interface Ethnicity1 {
  bin: EthnicityGrouping;
  count: EthnicityCount;
  [k: string]: unknown;
}
export interface Disease1 {
  diseaseCode: DiseaseCode;
  diseaseCodeVocabulary: DiseaseCodeVocabulary;
  count: DiseaseCount;
  [k: string]: unknown;
}
export interface Omics1 {
  assay?: OmicsAssay;
  platform?: OmicsPlatform;
}
