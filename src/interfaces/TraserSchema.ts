// type Ref = { $ref: string };
type AnyOf<T = unknown> = { anyOf: T[] };
// type AllOf<T = unknown> = { allOf: T[] };
// type Items<T = unknown> = { items: T; type?: string };
export interface Defs {
    AbstractText: AnyOf<{
        maxLength?: number;
        minLength?: number;
        type: string;
    }> & { title: string };
    Access: Record<string, unknown>;
    AccessService: { enum: string[]; title: string; type: string };
    Accessibility: Record<string, unknown>;
    Age: Record<string, unknown>;
    AgeEnum: { enum: string[]; title: string; type: string };
    Assay: { enum: string[]; title: string; type: string };
    CommaSeparatedValues: AnyOf<{ pattern?: string; type: string }> & {
        title: string;
    };
    ControlledVocabularyEnum: { enum: string[]; title: string; type: string };
    Coverage: Record<string, unknown>;
    DataColumn: Record<string, unknown>;
    DataTable: Record<string, unknown>;
    DataUseLimitationV2: { enum: string[]; title: string; type: string };
    DataUseRequirementsV2: { enum: string[]; title: string; type: string };
    DataValue: Record<string, unknown>;
    DatasetDescriptor: Record<string, unknown>;
    DeliveryLeadTimeV2: { enum: string[]; title: string; type: string };
    DemographicFrequency: Record<string, unknown>;
    Description: AnyOf<{
        maxLength?: number;
        minLength?: number;
        type: string;
    }> & { title: string };
    Disease: Record<string, unknown>;
    DiseaseCodeEnum: { enum: string[]; title: string; type: string };
    Documentation: Record<string, unknown>;
    Doi: AnyOf<{ pattern?: string; type: string }> & { title: string };
    EmailAddress: AnyOf<{ format?: string; type: string }> & { title: string };
    EndDateEnum: { enum: (string | undefined)[]; title: string };
    EnrichmentAndLinkage: Record<string, unknown>;
    EnvironmentAndEnergy: Record<string, unknown>;
    Ethnicity: Record<string, unknown>;
    EthnicityEnum: { enum: string[]; title: string; type: string };
    FollowupV2: { enum: (string | undefined)[]; title: string };
    Format: { minLength: number; title: string; type: string };
    FormatAndStandards: Record<string, unknown>;
    HealthAndDisease: Record<string, unknown>;
    HealthAndDiseaseSubTypes: { enum: string[]; title: string; type: string };
    ImagingAreaOfTheBody: Record<string, unknown>;
    ImagingAreaOfTheBodySubTypes: {
        enum: string[];
        title: string;
        type: string;
    };
    ImagingTypes: Record<string, unknown>;
    ImagingTypesSubTypes: { enum: string[]; title: string; type: string };
    InformationAndCommunication: Record<string, unknown>;
    Isocountrycode: { pattern: string; title: string; type: string };
    LanguageEnum: { enum: string[]; title: string; type: string };
    Lifestyle: Record<string, unknown>;
    LifestyleSubTypes: { enum: string[]; title: string; type: string };
    LongDescription: AnyOf<{
        maxLength?: number;
        minLength?: number;
        type: string;
    }> & { title: string };
    MaterialTypeCategoriesV2: { enum: string[]; title: string; type: string };
    MeasuredProperty: { title: string };
    MeasurementsTests: Record<string, unknown>;
    MeasurementsTestsSubTypes: { enum: string[]; title: string; type: string };
    MemberOfV2: { enum: string[]; title: string; type: string };
    Name: { title: string };
    NotApplicableSubTypes: { const: string; title: string };
    Observation: Record<string, unknown>;
    Omics: Record<string, unknown>;
    OmicsDataType: Record<string, unknown>;
    OmicsDataTypeSubTypes: { enum: string[]; title: string; type: string };
    OneHundredFiftyCharacters: {
        maxLength: number;
        minLength: number;
        title: string;
        type: string;
    };
    Organisation: Record<string, unknown>;
    Origin: Record<string, unknown>;
    PeriodicityV2: { enum: (string | undefined)[]; title: string };
    Pipeline: { enum: string[]; title: string; type: string };
    Platform: { enum: string[]; title: string; type: string };
    Politics: Record<string, unknown>;
    Provenance: Record<string, unknown>;
    PurposeV2: { enum: (string | undefined)[]; title: string };
    Registry: Record<string, unknown>;
    RegistrySubTypes: { enum: string[]; title: string; type: string };
    Revision: Record<string, unknown>;
    Semver: { pattern: string; title: string; type: string };
    SettingV2: { enum: (string | undefined)[]; title: string };
    ShortDescription: AnyOf<{
        maxLength?: number;
        minLength?: number;
        type: string;
    }> & { title: string };
    Socioeconomic: Record<string, unknown>;
    SocioeconomicSubTypes: { enum: string[]; title: string; type: string };
    SourceV2: { enum: string[]; title: string; type: string };
    StandardisedDataModelsEnum: { enum: string[]; title: string; type: string };
    StatisticalPopulationConstrainedV2: {
        enum: string[];
        title: string;
        type: string;
    };
    StructuralMetadata: Record<string, unknown>;
    Summary: Record<string, unknown>;
    Temporal: Record<string, unknown>;
    Ternary: { enum: string[]; title: string; type: string };
    TimeLagV2: { enum: string[]; title: string; type: string };
    TreatmentsInterventions: Record<string, unknown>;
    TreatmentsInterventionsSubTypes: {
        enum: string[];
        title: string;
        type: string;
    };
    Url: AnyOf<{ format?: string; minLength?: number; type: string }> & {
        title: string;
    };
    Usage: Record<string, unknown>;
    Uuidv4: {
        maxLength: number;
        minLength: number;
        pattern: string;
        title: string;
        type: string;
    };
}

export interface Schema {
    $defs: Defs;
    additionalProperties: boolean;
    properties: Record<string, unknown>;
    required: string[];
    title: string;
    type: string;
}
export interface TraserSchema {
    name: string;
    version: string;
    schema: Schema;
}
