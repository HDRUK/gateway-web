export interface TraserSchema {
  name: string
  version: string
  schema: Schema
}

interface Schema {
  $defs: Defs
  additionalProperties: boolean
  properties: Properties37
  required: string[]
  title: string
  type: string
}

export interface Defs {
  AbstractText: AbstractText
  Access: Access
  AccessService: AccessService2
  Accessibility: Accessibility
  Age: Age
  AgeEnum: AgeEnum
  Assay: Assay
  CommaSeparatedValues: CommaSeparatedValues
  ControlledVocabularyEnum: ControlledVocabularyEnum
  Coverage: Coverage
  DataColumn: DataColumn
  DataTable: DataTable
  DataUseLimitationV2: DataUseLimitationV2
  DataUseRequirementsV2: DataUseRequirementsV2
  DataValue: DataValue
  DatasetDescriptor: DatasetDescriptor
  DeliveryLeadTimeV2: DeliveryLeadTimeV2
  DemographicFrequency: DemographicFrequency
  Description: Description4
  Disease: Disease2
  DiseaseCodeEnum: DiseaseCodeEnum
  Documentation: Documentation
  Doi: Doi
  EmailAddress: EmailAddress
  EndDateEnum: EndDateEnum
  EnrichmentAndLinkage: EnrichmentAndLinkage
  EnvironmentAndEnergy: EnvironmentAndEnergy
  Ethnicity: Ethnicity2
  EthnicityEnum: EthnicityEnum
  FollowupV2: FollowupV2
  Format: Format
  FormatAndStandards: FormatAndStandards2
  HealthAndDisease: HealthAndDisease
  HealthAndDiseaseSubTypes: HealthAndDiseaseSubTypes
  ImagingAreaOfTheBody: ImagingAreaOfTheBody
  ImagingAreaOfTheBodySubTypes: ImagingAreaOfTheBodySubTypes
  ImagingTypes: ImagingTypes
  ImagingTypesSubTypes: ImagingTypesSubTypes
  InformationAndCommunication: InformationAndCommunication
  Isocountrycode: Isocountrycode
  LanguageEnum: LanguageEnum
  Lifestyle: Lifestyle
  LifestyleSubTypes: LifestyleSubTypes
  LongDescription: LongDescription
  MaterialTypeCategoriesV2: MaterialTypeCategoriesV2
  MeasuredProperty: MeasuredProperty
  MeasurementsTests: MeasurementsTests
  MeasurementsTestsSubTypes: MeasurementsTestsSubTypes
  MemberOfV2: MemberOfV2
  Name: Name11
  NotApplicableSubTypes: NotApplicableSubTypes
  Observation: Observation
  Omics: Omics
  OmicsDataType: OmicsDataType
  OmicsDataTypeSubTypes: OmicsDataTypeSubTypes
  OneHundredFiftyCharacters: OneHundredFiftyCharacters
  Organisation: Organisation
  Origin: Origin
  PeriodicityV2: PeriodicityV2
  Pipeline: Pipeline
  Platform: Platform2
  Politics: Politics
  Provenance: Provenance
  PurposeV2: PurposeV2
  Registry: Registry
  RegistrySubTypes: RegistrySubTypes
  Revision: Revision
  Semver: Semver
  SettingV2: SettingV2
  ShortDescription: ShortDescription
  Socioeconomic: Socioeconomic
  SocioeconomicSubTypes: SocioeconomicSubTypes
  SourceV2: SourceV2
  StandardisedDataModelsEnum: StandardisedDataModelsEnum
  StatisticalPopulationConstrainedV2: StatisticalPopulationConstrainedV2
  StructuralMetadata: StructuralMetadata
  Summary: Summary
  Temporal: Temporal2
  Ternary: Ternary
  TimeLagV2: TimeLagV2
  TreatmentsInterventions: TreatmentsInterventions
  TreatmentsInterventionsSubTypes: TreatmentsInterventionsSubTypes
  Url: Url3
  Usage: Usage2
  Uuidv4: Uuidv4
}

interface AbstractText {
  anyOf: AnyOf[]
  title: string
}

interface AnyOf {
  maxLength?: number
  minLength?: number
  type: string
}

interface Access {
  additionalProperties: boolean
  properties: Properties
  required: string[]
  title: string
  type: string
}

interface Properties {
  accessRights: AccessRights
  accessServiceCategory: AccessServiceCategory
  accessService: AccessService
  accessRequestCost: AccessRequestCost
  deliveryLeadTime: DeliveryLeadTime
  jurisdiction: Jurisdiction
  dataController: DataController
  dataProcessor: DataProcessor
}

interface AccessRights {
  allOf: AllOf[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf {
  $ref: string
}

interface AccessServiceCategory {
  anyOf: AnyOf2[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf2 {
  $ref?: string
  type?: string
}

interface AccessService {
  anyOf: AnyOf3[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf3 {
  $ref?: string
  type?: string
}

interface AccessRequestCost {
  anyOf: AnyOf4[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf4 {
  $ref?: string
  type?: string
}

interface DeliveryLeadTime {
  anyOf: AnyOf5[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf5 {
  $ref?: string
  type?: string
}

interface Jurisdiction {
  anyOf: AnyOf6[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf6 {
  items?: Items
  type: string
}

interface Items {
  $ref: string
}

interface DataController {
  anyOf: AnyOf7[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf7 {
  $ref?: string
  type?: string
}

interface DataProcessor {
  anyOf: AnyOf8[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf8 {
  $ref?: string
  type?: string
}

interface AccessService2 {
  enum: string[]
  title: string
  type: string
}

interface Accessibility {
  additionalProperties: boolean
  properties: Properties2
  required: string[]
  title: string
  type: string
}

interface Properties2 {
  usage: Usage
  access: Access2
  formatAndStandards: FormatAndStandards
}

interface Usage {
  anyOf: AnyOf9[]
  default: any
  description: string
  title: string
}

interface AnyOf9 {
  $ref?: string
  type?: string
}

interface Access2 {
  allOf: AllOf2[]
  description: string
  title: string
}

interface AllOf2 {
  $ref: string
}

interface FormatAndStandards {
  anyOf: AnyOf10[]
  default: any
  description: string
  title: string
}

interface AnyOf10 {
  $ref?: string
  type?: string
}

interface Age {
  properties: Properties3
  required: string[]
  title: string
  type: string
}

interface Properties3 {
  bin: Bin
  count: Count
}

interface Bin {
  allOf: AllOf3[]
  examples: string[]
  title: string
}

interface AllOf3 {
  $ref: string
}

interface Count {
  examples: number[]
  title: string
  type: string
}

interface AgeEnum {
  enum: string[]
  title: string
  type: string
}

interface Assay {
  enum: string[]
  title: string
  type: string
}

interface CommaSeparatedValues {
  anyOf: AnyOf11[]
  title: string
}

interface AnyOf11 {
  pattern?: string
  type: string
}

interface ControlledVocabularyEnum {
  enum: string[]
  title: string
  type: string
}

interface Coverage {
  additionalProperties: boolean
  properties: Properties4
  required: string[]
  title: string
  type: string
}

interface Properties4 {
  spatial: Spatial
  typicalAgeRangeMin: TypicalAgeRangeMin
  typicalAgeRangeMax: TypicalAgeRangeMax
  datasetCompleteness: DatasetCompleteness
  materialType: MaterialType
  followUp: FollowUp
  pathway: Pathway
}

interface Spatial {
  anyOf: AnyOf12[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf12 {
  $ref?: string
  items?: Items2
  type?: string
}

interface Items2 {
  $ref: string
}

interface TypicalAgeRangeMin {
  anyOf: AnyOf13[]
  default: any
  description: string
  examples: number[]
  guidance: string
  title: string
}

interface AnyOf13 {
  type: string
}

interface TypicalAgeRangeMax {
  anyOf: AnyOf14[]
  default: any
  description: string
  examples: number[]
  guidance: string
  title: string
}

interface AnyOf14 {
  type: string
}

interface DatasetCompleteness {
  anyOf: AnyOf15[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf15 {
  $ref?: string
  type?: string
}

interface MaterialType {
  anyOf: AnyOf16[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf16 {
  items?: Items3
  type: string
}

interface Items3 {
  $ref: string
}

interface FollowUp {
  anyOf: AnyOf17[]
  default: string
  description: string
  guidance: string
  title: string
}

interface AnyOf17 {
  $ref?: string
  type?: string
}

interface Pathway {
  anyOf: AnyOf18[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf18 {
  $ref?: string
  type?: string
}

interface DataColumn {
  properties: Properties5
  required: string[]
  title: string
  type: string
}

interface Properties5 {
  name: Name
  dataType: DataType
  description: Description
  sensitive: Sensitive
  values: Values
}

interface Name {
  allOf: AllOf4[]
  description: string
  title: string
}

interface AllOf4 {
  $ref: string
}

interface DataType {
  description: string
  title: string
  type: string
}

interface Description {
  anyOf: AnyOf19[]
  default: any
  description: string
  title: string
}

interface AnyOf19 {
  maxLength?: number
  minLength?: number
  type: string
}

interface Sensitive {
  description: string
  title: string
  type: string
}

interface Values {
  anyOf: AnyOf20[]
  default: any
  description: string
  title: string
}

interface AnyOf20 {
  items?: Items4
  type: string
}

interface Items4 {
  $ref: string
}

interface DataTable {
  additionalProperties: boolean
  properties: Properties6
  required: string[]
  title: string
  type: string
}

interface Properties6 {
  name: Name2
  description: Description2
  columns: Columns
}

interface Name2 {
  anyOf: AnyOf21[]
  default: any
  description: string
  title: string
}

interface AnyOf21 {
  maxLength?: number
  minLength?: number
  type: string
}

interface Description2 {
  anyOf: AnyOf22[]
  default: any
  description: string
  title: string
}

interface AnyOf22 {
  maxLength?: number
  minLength?: number
  type: string
}

interface Columns {
  description: string
  items: Items5
  title: string
  type: string
}

interface Items5 {
  $ref: string
}

interface DataUseLimitationV2 {
  enum: string[]
  title: string
  type: string
}

interface DataUseRequirementsV2 {
  enum: string[]
  title: string
  type: string
}

interface DataValue {
  properties: Properties7
  required: string[]
  title: string
  type: string
}

interface Properties7 {
  name: Name3
  description: Description3
  frequency: Frequency
}

interface Name3 {
  allOf: AllOf5[]
  description: string
  title: string
}

interface AllOf5 {
  $ref: string
}

interface Description3 {
  anyOf: AnyOf23[]
  default: any
  description: string
  title: string
}

interface AnyOf23 {
  maxLength?: number
  minLength?: number
  type: string
}

interface Frequency {
  anyOf: AnyOf24[]
  default: any
  description: string
  title: string
}

interface AnyOf24 {
  type: string
}

interface DatasetDescriptor {
  properties: Properties8
  title: string
  type: string
}

interface Properties8 {
  pid: Pid
  title: Title
  url: Url
}

interface Pid {
  anyOf: AnyOf25[]
  default: any
  title: string
}

interface AnyOf25 {
  $ref?: string
  type?: string
}

interface Title {
  anyOf: AnyOf26[]
  default: any
  title: string
}

interface AnyOf26 {
  $ref?: string
  type?: string
}

interface Url {
  anyOf: AnyOf27[]
  default: any
  title: string
}

interface AnyOf27 {
  $ref?: string
  type?: string
}

interface DeliveryLeadTimeV2 {
  enum: string[]
  title: string
  type: string
}

interface DemographicFrequency {
  additionalProperties: boolean
  properties: Properties9
  title: string
  type: string
}

interface Properties9 {
  age: Age2
  ethnicity: Ethnicity
  disease: Disease
}

interface Age2 {
  anyOf: AnyOf28[]
  default: any
  description: string
  title: string
}

interface AnyOf28 {
  items?: Items6
  type: string
}

interface Items6 {
  $ref: string
}

interface Ethnicity {
  anyOf: AnyOf29[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf29 {
  items?: Items7
  type: string
}

interface Items7 {
  $ref: string
}

interface Disease {
  anyOf: AnyOf30[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf30 {
  items?: Items8
  type: string
}

interface Items8 {
  $ref: string
}

interface Description4 {
  anyOf: AnyOf31[]
  title: string
}

interface AnyOf31 {
  maxLength?: number
  minLength?: number
  type: string
}

interface Disease2 {
  properties: Properties10
  required: string[]
  title: string
  type: string
}

interface Properties10 {
  diseaseCode: DiseaseCode
  diseaseCodeVocabulary: DiseaseCodeVocabulary
  count: Count2
}

interface DiseaseCode {
  anyOf: AnyOf32[]
  examples: string[]
  title: string
}

interface AnyOf32 {
  type: string
}

interface DiseaseCodeVocabulary {
  allOf: AllOf6[]
  examples: string[]
  title: string
}

interface AllOf6 {
  $ref: string
}

interface Count2 {
  examples: number[]
  title: string
  type: string
}

interface DiseaseCodeEnum {
  enum: string[]
  title: string
  type: string
}

interface Documentation {
  additionalProperties: boolean
  properties: Properties11
  required: string[]
  title: string
  type: string
}

interface Properties11 {
  description: Description5
  associatedMedia: AssociatedMedia
  inPipeline: InPipeline
}

interface Description5 {
  allOf: AllOf7[]
  description: string
  examples: string[]
  guidance: string
}

interface AllOf7 {
  $ref: string
}

interface AssociatedMedia {
  anyOf: AnyOf33[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf33 {
  $ref?: string
  items?: Items9
  type?: string
}

interface Items9 {
  anyOf: AnyOf34[]
}

interface AnyOf34 {
  $ref?: string
  type?: string
}

interface InPipeline {
  anyOf: AnyOf35[]
  default: string
  description: string
  guidance: string
  title: string
}

interface AnyOf35 {
  $ref?: string
  type?: string
}

interface Doi {
  anyOf: AnyOf36[]
  title: string
}

interface AnyOf36 {
  pattern?: string
  type: string
}

interface EmailAddress {
  anyOf: AnyOf37[]
  title: string
}

interface AnyOf37 {
  format?: string
  type: string
}

interface EndDateEnum {
  enum: string | undefined[]
  title: string
}

interface EnrichmentAndLinkage {
  additionalProperties: boolean
  properties: Properties12
  title: string
  type: string
}

interface Properties12 {
  derivedFrom: DerivedFrom
  isPartOf: IsPartOf
  linkableDatasets: LinkableDatasets
  similarToDatasets: SimilarToDatasets
  investigations: Investigations
  tools: Tools
  publicationAboutDataset: PublicationAboutDataset
  publicationUsingDataset: PublicationUsingDataset
}

interface DerivedFrom {
  anyOf: AnyOf38[]
  default: any
  description: string
  title: string
}

interface AnyOf38 {
  items?: Items10
  type: string
}

interface Items10 {
  $ref: string
}

interface IsPartOf {
  anyOf: AnyOf39[]
  default: any
  description: string
  examples: string[]
  title: string
}

interface AnyOf39 {
  items?: Items11
  type: string
}

interface Items11 {
  $ref: string
}

interface LinkableDatasets {
  anyOf: AnyOf40[]
  default: any
  description: string
  title: string
}

interface AnyOf40 {
  items?: Items12
  type: string
}

interface Items12 {
  $ref: string
}

interface SimilarToDatasets {
  anyOf: AnyOf41[]
  default: any
  description: string
  title: string
}

interface AnyOf41 {
  items?: Items13
  type: string
}

interface Items13 {
  $ref: string
}

interface Investigations {
  anyOf: AnyOf42[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf42 {
  items?: Items14
  type: string
}

interface Items14 {
  $ref: string
}

interface Tools {
  anyOf: AnyOf43[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf43 {
  items?: Items15
  type: string
}

interface Items15 {
  $ref: string
}

interface PublicationAboutDataset {
  anyOf: AnyOf44[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf44 {
  items?: Items16
  type: string
}

interface Items16 {
  $ref: string
}

interface PublicationUsingDataset {
  anyOf: AnyOf45[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf45 {
  items?: Items17
  type: string
}

interface Items17 {
  $ref: string
}

interface EnvironmentAndEnergy {
  properties: Properties13
  required: string[]
  title: string
  type: string
}

interface Properties13 {
  name: Name4
  subTypes: SubTypes
}

interface Name4 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes {
  anyOf: AnyOf46[]
  title: string
}

interface AnyOf46 {
  items?: Items18
  type: string
}

interface Items18 {
  $ref: string
}

interface Ethnicity2 {
  properties: Properties14
  required: string[]
  title: string
  type: string
}

interface Properties14 {
  bin: Bin2
  count: Count3
}

interface Bin2 {
  allOf: AllOf8[]
  examples: string[]
  title: string
}

interface AllOf8 {
  $ref: string
}

interface Count3 {
  examples: number[]
  title: string
  type: string
}

interface EthnicityEnum {
  enum: string[]
  title: string
  type: string
}

interface FollowupV2 {
  enum: string | undefined[]
  title: string
}

interface Format {
  minLength: number
  title: string
  type: string
}

interface FormatAndStandards2 {
  additionalProperties: boolean
  properties: Properties15
  required: string[]
  title: string
  type: string
}

interface Properties15 {
  vocabularyEncodingScheme: VocabularyEncodingScheme
  conformsTo: ConformsTo
  language: Language
  format: Format2
}

interface VocabularyEncodingScheme {
  description: string
  examples: string[]
  guidance: string
  items: Items19
  title: string
  type: string
}

interface Items19 {
  $ref: string
}

interface ConformsTo {
  description: string
  examples: string[]
  guidance: string
  items: Items20
  title: string
  type: string
}

interface Items20 {
  $ref: string
}

interface Language {
  description: string
  examples: string[]
  guidance: string
  items: Items21
  title: string
  type: string
}

interface Items21 {
  $ref: string
}

interface Format2 {
  description: string
  examples: string[]
  guidance: string
  items: Items22
  title: string
  type: string
}

interface Items22 {
  $ref: string
}

interface HealthAndDisease {
  properties: Properties16
  required: string[]
  title: string
  type: string
}

interface Properties16 {
  name: Name5
  subTypes: SubTypes2
}

interface Name5 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes2 {
  anyOf: AnyOf47[]
  title: string
}

interface AnyOf47 {
  items?: Items23
  type: string
}

interface Items23 {
  $ref: string
}

interface HealthAndDiseaseSubTypes {
  enum: string[]
  title: string
  type: string
}

interface ImagingAreaOfTheBody {
  properties: Properties17
  required: string[]
  title: string
  type: string
}

interface Properties17 {
  name: Name6
  subTypes: SubTypes3
}

interface Name6 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes3 {
  anyOf: AnyOf48[]
  title: string
}

interface AnyOf48 {
  items?: Items24
  type: string
}

interface Items24 {
  $ref: string
}

interface ImagingAreaOfTheBodySubTypes {
  enum: string[]
  title: string
  type: string
}

interface ImagingTypes {
  properties: Properties18
  required: string[]
  title: string
  type: string
}

interface Properties18 {
  name: Name7
  subTypes: SubTypes4
}

interface Name7 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes4 {
  anyOf: AnyOf49[]
  title: string
}

interface AnyOf49 {
  items?: Items25
  type: string
}

interface Items25 {
  $ref: string
}

interface ImagingTypesSubTypes {
  enum: string[]
  title: string
  type: string
}

interface InformationAndCommunication {
  properties: Properties19
  required: string[]
  title: string
  type: string
}

interface Properties19 {
  name: Name8
  subTypes: SubTypes5
}

interface Name8 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes5 {
  anyOf: AnyOf50[]
  title: string
}

interface AnyOf50 {
  items?: Items26
  type: string
}

interface Items26 {
  $ref: string
}

interface Isocountrycode {
  pattern: string
  title: string
  type: string
}

interface LanguageEnum {
  enum: string[]
  title: string
  type: string
}

interface Lifestyle {
  properties: Properties20
  required: string[]
  title: string
  type: string
}

interface Properties20 {
  name: Name9
  subTypes: SubTypes6
}

interface Name9 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes6 {
  anyOf: AnyOf51[]
  title: string
}

interface AnyOf51 {
  items?: Items27
  type: string
}

interface Items27 {
  $ref: string
}

interface LifestyleSubTypes {
  enum: string[]
  title: string
  type: string
}

interface LongDescription {
  anyOf: AnyOf52[]
  title: string
}

interface AnyOf52 {
  maxLength?: number
  minLength?: number
  type: string
}

interface MaterialTypeCategoriesV2 {
  enum: string[]
  title: string
  type: string
}

interface MeasuredProperty {
  title: string
}

interface MeasurementsTests {
  properties: Properties21
  required: string[]
  title: string
  type: string
}

interface Properties21 {
  name: Name10
  subTypes: SubTypes7
}

interface Name10 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes7 {
  anyOf: AnyOf53[]
  title: string
}

interface AnyOf53 {
  items?: Items28
  type: string
}

interface Items28 {
  $ref: string
}

interface MeasurementsTestsSubTypes {
  enum: string[]
  title: string
  type: string
}

interface MemberOfV2 {
  enum: string[]
  title: string
  type: string
}

interface Name11 {
  title: string
}

interface NotApplicableSubTypes {
  const: string
  title: string
}

interface Observation {
  additionalProperties: boolean
  properties: Properties22
  required: string[]
  title: string
  type: string
}

interface Properties22 {
  observedNode: ObservedNode
  measuredValue: MeasuredValue
  disambiguatingDescription: DisambiguatingDescription
  observationDate: ObservationDate
  measuredProperty: MeasuredProperty2
}

interface ObservedNode {
  allOf: AllOf9[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf9 {
  $ref: string
}

interface MeasuredValue {
  description: string
  examples: number[]
  guidance: string
  title: string
  type: string
}

interface DisambiguatingDescription {
  anyOf: AnyOf54[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf54 {
  $ref?: string
  type?: string
}

interface ObservationDate {
  anyOf: AnyOf55[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf55 {
  format: string
  type: string
}

interface MeasuredProperty2 {
  allOf: AllOf10[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf10 {
  $ref: string
}

interface Omics {
  additionalProperties: boolean
  properties: Properties23
  title: string
  type: string
}

interface Properties23 {
  assay: Assay2
  platform: Platform
}

interface Assay2 {
  anyOf: AnyOf56[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf56 {
  $ref?: string
  type?: string
}

interface Platform {
  anyOf: AnyOf57[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf57 {
  $ref?: string
  type?: string
}

interface OmicsDataType {
  properties: Properties24
  required: string[]
  title: string
  type: string
}

interface Properties24 {
  name: Name12
  subTypes: SubTypes8
}

interface Name12 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes8 {
  anyOf: AnyOf58[]
  title: string
}

interface AnyOf58 {
  items?: Items29
  type: string
}

interface Items29 {
  $ref: string
}

interface OmicsDataTypeSubTypes {
  enum: string[]
  title: string
  type: string
}

interface OneHundredFiftyCharacters {
  maxLength: number
  minLength: number
  title: string
  type: string
}

interface Organisation {
  additionalProperties: boolean
  properties: Properties25
  required: string[]
  title: string
  type: string
}

interface Properties25 {
  identifier: Identifier
  name: Name13
  logo: Logo
  description: Description6
  contactPoint: ContactPoint
  memberOf: MemberOf
}

interface Identifier {
  anyOf: AnyOf59[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf59 {
  maxLength?: number
  minLength?: number
  type: string
}

interface Name13 {
  allOf: AllOf11[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf11 {
  $ref: string
}

interface Logo {
  anyOf: AnyOf60[]
  default: any
  description: string
  title: string
}

interface AnyOf60 {
  $ref?: string
  type?: string
}

interface Description6 {
  anyOf: AnyOf61[]
  default: any
  description: string
  title: string
}

interface AnyOf61 {
  $ref?: string
  type?: string
}

interface ContactPoint {
  anyOf: AnyOf62[]
  description: string
  examples: string[]
  title: string
}

interface AnyOf62 {
  $ref?: string
  items?: Items30
  type?: string
}

interface Items30 {
  $ref: string
}

interface MemberOf {
  anyOf: AnyOf63[]
  default: any
  description: string
  title: string
}

interface AnyOf63 {
  $ref?: string
  type?: string
}

interface Origin {
  additionalProperties: boolean
  properties: Properties26
  required: string[]
  title: string
  type: string
}

interface Properties26 {
  purpose: Purpose
  datasetType: DatasetType
  source: Source
  collectionSource: CollectionSource
  imageContrast: ImageContrast
}

interface Purpose {
  anyOf: AnyOf64[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf64 {
  items?: Items31
  type: string
}

interface Items31 {
  $ref: string
}

interface DatasetType {
  description: string
  examples: string[]
  guidance: string
  items: Items32
  title: string
  type: string
}

interface Items32 {
  anyOf: AnyOf65[]
}

interface AnyOf65 {
  $ref: string
}

interface Source {
  anyOf: AnyOf66[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf66 {
  items?: Items33
  type: string
}

interface Items33 {
  $ref: string
}

interface CollectionSource {
  anyOf: AnyOf67[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf67 {
  items?: Items34
  type: string
}

interface Items34 {
  $ref: string
}

interface ImageContrast {
  anyOf: AnyOf68[]
  default: string
  description: string
  guidance: string
  title: string
}

interface AnyOf68 {
  $ref?: string
  type?: string
}

interface PeriodicityV2 {
  enum: string | undefined[]
  title: string
}

interface Pipeline {
  enum: string[]
  title: string
  type: string
}

interface Platform2 {
  enum: string[]
  title: string
  type: string
}

interface Politics {
  properties: Properties27
  required: string[]
  title: string
  type: string
}

interface Properties27 {
  name: Name14
  subTypes: SubTypes9
}

interface Name14 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes9 {
  anyOf: AnyOf69[]
  title: string
}

interface AnyOf69 {
  items?: Items35
  type: string
}

interface Items35 {
  $ref: string
}

interface Provenance {
  additionalProperties: boolean
  properties: Properties28
  required: string[]
  title: string
  type: string
}

interface Properties28 {
  origin: Origin2
  temporal: Temporal
}

interface Origin2 {
  anyOf: AnyOf70[]
  default: any
  description: string
  title: string
}

interface AnyOf70 {
  $ref?: string
  type?: string
}

interface Temporal {
  allOf: AllOf12[]
  description: string
  title: string
}

interface AllOf12 {
  $ref: string
}

interface PurposeV2 {
  enum: string | undefined[]
  title: string
}

interface Registry {
  properties: Properties29
  required: string[]
  title: string
  type: string
}

interface Properties29 {
  name: Name15
  subTypes: SubTypes10
}

interface Name15 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes10 {
  anyOf: AnyOf71[]
  title: string
}

interface AnyOf71 {
  items?: Items36
  type: string
}

interface Items36 {
  $ref: string
}

interface RegistrySubTypes {
  enum: string[]
  title: string
  type: string
}

interface Revision {
  additionalProperties: boolean
  properties: Properties30
  required: string[]
  title: string
  type: string
}

interface Properties30 {
  version: Version
  url: Url2
}

interface Version {
  allOf: AllOf13[]
  description: string
  examples: string[]
  title: string
}

interface AllOf13 {
  $ref: string
}

interface Url2 {
  anyOf: AnyOf72[]
  default: any
  description: string
  examples: string[]
  title: string
}

interface AnyOf72 {
  $ref?: string
  type?: string
}

interface Semver {
  pattern: string
  title: string
  type: string
}

interface SettingV2 {
  enum: string | undefined[]
  title: string
}

interface ShortDescription {
  anyOf: AnyOf73[]
  title: string
}

interface AnyOf73 {
  maxLength?: number
  minLength?: number
  type: string
}

interface Socioeconomic {
  properties: Properties31
  required: string[]
  title: string
  type: string
}

interface Properties31 {
  name: Name16
  subTypes: SubTypes11
}

interface Name16 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes11 {
  anyOf: AnyOf74[]
  title: string
}

interface AnyOf74 {
  items?: Items37
  type: string
}

interface Items37 {
  $ref: string
}

interface SocioeconomicSubTypes {
  enum: string[]
  title: string
  type: string
}

interface SourceV2 {
  enum: string[]
  title: string
  type: string
}

interface StandardisedDataModelsEnum {
  enum: string[]
  title: string
  type: string
}

interface StatisticalPopulationConstrainedV2 {
  enum: string[]
  title: string
  type: string
}

interface StructuralMetadata {
  additionalProperties: boolean
  properties: Properties32
  title: string
  type: string
}

interface Properties32 {
  tables: Tables
  syntheticDataWebLink: SyntheticDataWebLink
}

interface Tables {
  anyOf: AnyOf75[]
  default: any
  description: string
  title: string
}

interface AnyOf75 {
  items?: Items38
  type: string
}

interface Items38 {
  $ref: string
}

interface SyntheticDataWebLink {
  anyOf: AnyOf76[]
  default: any
  description: string
  title: string
}

interface AnyOf76 {
  items?: Items39
  type: string
}

interface Items39 {
  $ref: string
}

interface Summary {
  additionalProperties: boolean
  properties: Properties33
  required: string[]
  title: string
  type: string
}

interface Properties33 {
  title: Title2
  abstract: Abstract
  dataCustodian: DataCustodian
  populationSize: PopulationSize
  keywords: Keywords
  doiName: DoiName
  contactPoint: ContactPoint2
  datasetAliases: DatasetAliases
}

interface Title2 {
  allOf: AllOf14[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf14 {
  $ref: string
}

interface Abstract {
  allOf: AllOf15[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf15 {
  $ref: string
}

interface DataCustodian {
  allOf: AllOf16[]
  description: string
  title: string
}

interface AllOf16 {
  $ref: string
}

interface PopulationSize {
  description: string
  examples: number[]
  guidance: string
  title: string
  type: string
}

interface Keywords {
  anyOf: AnyOf77[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf77 {
  items?: Items40
  type: string
}

interface Items40 {
  $ref: string
}

interface DoiName {
  anyOf: AnyOf78[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf78 {
  $ref?: string
  type?: string
}

interface ContactPoint2 {
  allOf: AllOf17[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf17 {
  $ref: string
}

interface DatasetAliases {
  anyOf: AnyOf79[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf79 {
  $ref?: string
  items?: Items41
  type?: string
}

interface Items41 {
  anyOf: AnyOf80[]
}

interface AnyOf80 {
  $ref?: string
  type?: string
}

interface Temporal2 {
  additionalProperties: boolean
  properties: Properties34
  required: string[]
  title: string
  type: string
}

interface Properties34 {
  publishingFrequency: PublishingFrequency
  distributionReleaseDate: DistributionReleaseDate
  startDate: StartDate
  endDate: EndDate
  timeLag: TimeLag
}

interface PublishingFrequency {
  allOf: AllOf18[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf18 {
  $ref: string
}

interface DistributionReleaseDate {
  anyOf: AnyOf81[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf81 {
  format?: string
  type: string
}

interface StartDate {
  anyOf: AnyOf82[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf82 {
  format: string
  type: string
}

interface EndDate {
  anyOf: AnyOf83[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf83 {
  format?: string
  type?: string
  $ref?: string
}

interface TimeLag {
  allOf: AllOf19[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf19 {
  $ref: string
}

interface Ternary {
  enum: string[]
  title: string
  type: string
}

interface TimeLagV2 {
  enum: string[]
  title: string
  type: string
}

interface TreatmentsInterventions {
  properties: Properties35
  required: string[]
  title: string
  type: string
}

interface Properties35 {
  name: Name17
  subTypes: SubTypes12
}

interface Name17 {
  Literal: boolean
  default: string
  title: string
  type: string
}

interface SubTypes12 {
  anyOf: AnyOf84[]
  title: string
}

interface AnyOf84 {
  items?: Items42
  type: string
}

interface Items42 {
  $ref: string
}

interface TreatmentsInterventionsSubTypes {
  enum: string[]
  title: string
  type: string
}

interface Url3 {
  anyOf: AnyOf85[]
  title: string
}

interface AnyOf85 {
  format?: string
  minLength?: number
  type: string
}

interface Usage2 {
  additionalProperties: boolean
  properties: Properties36
  title: string
  type: string
}

interface Properties36 {
  dataUseLimitation: DataUseLimitation
  dataUseRequirements: DataUseRequirements
  resourceCreator: ResourceCreator
}

interface DataUseLimitation {
  anyOf: AnyOf86[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf86 {
  items?: Items43
  type: string
}

interface Items43 {
  $ref: string
}

interface DataUseRequirements {
  anyOf: AnyOf87[]
  default: any
  description: string
  guidance: string
  title: string
}

interface AnyOf87 {
  items?: Items44
  type: string
}

interface Items44 {
  $ref: string
}

interface ResourceCreator {
  anyOf: AnyOf88[]
  default: any
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf88 {
  $ref?: string
  items?: Items45
  type?: string
}

interface Items45 {
  anyOf: AnyOf89[]
}

interface AnyOf89 {
  $ref?: string
  type?: string
}

interface Uuidv4 {
  maxLength: number
  minLength: number
  pattern: string
  title: string
  type: string
}

interface Properties37 {
  identifier: Identifier2
  version: Version2
  revisions: Revisions
  issued: Issued
  modified: Modified
  summary: Summary2
  documentation: Documentation2
  coverage: Coverage2
  provenance: Provenance2
  accessibility: Accessibility2
  enrichmentAndLinkage: EnrichmentAndLinkage2
  observations: Observations
  structuralMetadata: StructuralMetadata2
  demographicFrequency: DemographicFrequency2
  omics: Omics2
}

interface Identifier2 {
  anyOf: AnyOf90[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AnyOf90 {
  $ref?: string
  type?: string
}

interface Version2 {
  allOf: AllOf20[]
  description: string
  examples: string[]
  guidance: string
  title: string
}

interface AllOf20 {
  $ref: string
}

interface Revisions {
  description: string
  items: Items46
  title: string
  type: string
}

interface Items46 {
  $ref: string
}

interface Issued {
  description: string
  examples: string[]
  format: string
  title: string
  type: string
}

interface Modified {
  description: string
  examples: string[]
  format: string
  title: string
  type: string
}

interface Summary2 {
  allOf: AllOf21[]
  description: string
}

interface AllOf21 {
  $ref: string
}

interface Documentation2 {
  anyOf: AnyOf91[]
  default: any
  description: string
  title: string
}

interface AnyOf91 {
  $ref?: string
  type?: string
}

interface Coverage2 {
  anyOf: AnyOf92[]
  default: any
  description: string
  title: string
}

interface AnyOf92 {
  $ref?: string
  type?: string
}

interface Provenance2 {
  anyOf: AnyOf93[]
  default: any
  description: string
  title: string
}

interface AnyOf93 {
  $ref?: string
  type?: string
}

interface Accessibility2 {
  allOf: AllOf22[]
  description: string
}

interface AllOf22 {
  $ref: string
}

interface EnrichmentAndLinkage2 {
  anyOf: AnyOf94[]
  default: any
  description: string
  title: string
}

interface AnyOf94 {
  $ref?: string
  type?: string
}

interface Observations {
  description: string
  items: Items47
  title: string
  type: string
}

interface Items47 {
  $ref: string
}

interface StructuralMetadata2 {
  anyOf: AnyOf95[]
  default: any
  description: string
  title: string
}

interface AnyOf95 {
  $ref?: string
  type?: string
}

interface DemographicFrequency2 {
  anyOf: AnyOf96[]
  default: any
  description: string
  title: string
}

interface AnyOf96 {
  $ref?: string
  type?: string
}

interface Omics2 {
  anyOf: AnyOf97[]
  default: any
  description: string
  title: string
}

interface AnyOf97 {
  $ref?: string
  type?: string
}
