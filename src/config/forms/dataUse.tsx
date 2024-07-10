import * as yup from "yup";
import { inputComponents } from ".";

const defaultValues = {
    organisation_name: "",
    organisation_id: "",
    organisation_sector: "",
    applicant_id: "",
    funders_and_sponsors: [],
    sublicence_arrangements: "",
    accredited_researcher_status: "",
    project_id_text: "",
    project_title: "",
    lay_summary: "",
    public_benefit_statement: "",
    request_category_type: "",
    technical_summary: "",
    other_approval_committees: [],
    project_start_date: "",
    project_end_date: "",
    latest_approval_date: "",
    data_sensitivity_level: "",
    legal_basis_for_data_article6: "",
    legal_basis_for_data_article9: "",
    duty_of_confidentiality: "",
    national_data_optout: "",
    request_frequency: "",
    dataset_linkage_description: "",
    confidential_data_description: "",
    access_date: "",
    access_type: "",
    privacy_enhancements: "",
    safeOutput: [],
    applicants: [],
    datasets: [],
    keywords: [],
};

const validationSchema = yup.object({
    organisation_name: yup.string().required("This cannot be empty"),
    project_title: yup.string().required("This cannot be empty"),
    lay_summary: yup.string().max(3000, "Maximum of 3,000 characters"),
});

const yesNoList = [
    { label: "", value: "" },
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
];

const yesNoNotList = [
    { label: "", value: "" },
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Not applicable", value: "Not applicable" },
];

const organisationSectorList = [
    { label: "", value: "" },
    { label: "Academic Institute", value: "Academic Institute" },
    {
        label: "CQC Registered Health or/and Social Care provider",
        value: "CQC Registered Health or/and Social Care provider",
    },
    {
        label: "Independent Sector Organisation",
        value: "Independent Sector Organisation",
    },
    {
        label: "Government Agency (Health and Adult Social Care)",
        value: "Government Agency (Health and Adult Social Care)",
    },
    { label: "Commercial", value: "Commercial" },
    { label: "Local authority", value: "Local authority" },
    { label: "Government Agency (Other)", value: "Government Agency (Other)" },
];

const requestCategoryTypeList = [
    { label: "", value: "" },
    {
        label: "Efficacy & Mechanism Evaluation",
        value: "Efficacy & Mechanism Evaluation",
    },
    {
        label: "Health Services & Delivery",
        value: "Health Services & Delivery",
    },
    {
        label: "Health Technology Assessment",
        value: "Health Technology Assessment",
    },
    { label: "Public Health Research", value: "Public Health Research" },
    { label: "Other", value: "Other" },
];

const dataSensitivityLevelList = [
    { label: "", value: "" },
    { label: "Personally Identifiable", value: "Personally Identifiable" },
    { label: "De-Personalised", value: "De-Personalised" },
    { label: "Anonymous", value: "Anonymous" },
];

const legalBasisForDataArticle6List = [
    { label: "", value: "" },
    { label: "Not applicable", value: "Not applicable" },
    {
        label: "(a) the data subject has given consent to the processing of his or her personal data for one or more specific purposes;",
        value: "(a) the data subject has given consent to the processing of his or her personal data for one or more specific purposes;",
    },
    {
        label: "(b) processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract;",
        value: "(b) processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract;",
    },
    {
        label: "(c) processing is necessary for compliance with a legal obligation to which the controller is subject;",
        value: "(c) processing is necessary for compliance with a legal obligation to which the controller is subject;",
    },
    {
        label: "(d) processing is necessary in order to protect the vital interests of the data subject or of another natural person;",
        value: "(d) processing is necessary in order to protect the vital interests of the data subject or of another natural person;",
    },
    {
        label: "(e) processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller;",
        value: "(e) processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller;",
    },
    {
        label: "(f) processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data, in particular where the data subject is a child.",
        value: "(f) processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data, in particular where the data subject is a child.",
    },
];

const legalBasisForDataArticle9List = [
    { label: "", value: "" },
    { label: "Not applicable", value: "Not applicable" },
    {
        label: "(a) the data subject has given explicit consent to the processing of those personal data for one or more specified purposes, except where Union or Member State law provide that the prohibition referred to in paragraph 1 may not be lifted by the data subject;",
        value: "(a) the data subject has given explicit consent to the processing of those personal data for one or more specified purposes, except where Union or Member State law provide that the prohibition referred to in paragraph 1 may not be lifted by the data subject;",
    },
    {
        label: "(b) processing is necessary for the purposes of carrying out the obligations and exercising specific rights of the controller or of the data subject in the field of employment and social security and social protection law in so far as it is authorised by Union or Member State law or a collective agreement pursuant to Member State law providing for appropriate safeguards for the fundamental rights and the interests of the data subject;",
        value: "(b) processing is necessary for the purposes of carrying out the obligations and exercising specific rights of the controller or of the data subject in the field of employment and social security and social protection law in so far as it is authorised by Union or Member State law or a collective agreement pursuant to Member State law providing for appropriate safeguards for the fundamental rights and the interests of the data subject;",
    },
    {
        label: "(c) processing is necessary to protect the vital interests of the data subject or of another natural person where the data subject is physically or legally incapable of giving consent;",
        value: "(c) processing is necessary to protect the vital interests of the data subject or of another natural person where the data subject is physically or legally incapable of giving consent;",
    },
    {
        label: "(d) processing is carried out in the course of its legitimate activities with appropriate safeguards by a foundation, association or any other not-for-profit body with a political, philosophical, religious or trade union aim and on condition that the processing relates solely to the members or to former members of the body or to persons who have regular contact with it in connection with its purposes and that the personal data are not disclosed outside that body without the consent of the data subjects;",
        value: "(d) processing is carried out in the course of its legitimate activities with appropriate safeguards by a foundation, association or any other not-for-profit body with a political, philosophical, religious or trade union aim and on condition that the processing relates solely to the members or to former members of the body or to persons who have regular contact with it in connection with its purposes and that the personal data are not disclosed outside that body without the consent of the data subjects;",
    },
    {
        label: "(e) processing relates to personal data which are manifestly made public by the data subject;",
        value: "(e) processing relates to personal data which are manifestly made public by the data subject;",
    },
    {
        label: "(f) processing is necessary for the establishment, exercise or defence of legal claims or whenever courts are acting in their judicial capacity;",
        value: "(f) processing is necessary for the establishment, exercise or defence of legal claims or whenever courts are acting in their judicial capacity;",
    },
    {
        label: "(g) processing is necessary for reasons of substantial public interest, on the basis of Union or Member State law which shall be proportionate to the aim pursued, respect the essence of the right to data protection and provide for suitable and specific measures to safeguard the fundamental rights and the interests of the data subject;",
        value: "(g) processing is necessary for reasons of substantial public interest, on the basis of Union or Member State law which shall be proportionate to the aim pursued, respect the essence of the right to data protection and provide for suitable and specific measures to safeguard the fundamental rights and the interests of the data subject;",
    },
    {
        label: "(h) processing is necessary for the purposes of preventive or occupational medicine, for the assessment of the working capacity of the employee, medical diagnosis, the provision of health or social care or treatment or the management of health or social care systems and services on the basis of Union or Member State law or pursuant to contract with a health professional and subject to the conditions and safeguards referred to in paragraph 3;",
        value: "(h) processing is necessary for the purposes of preventive or occupational medicine, for the assessment of the working capacity of the employee, medical diagnosis, the provision of health or social care or treatment or the management of health or social care systems and services on the basis of Union or Member State law or pursuant to contract with a health professional and subject to the conditions and safeguards referred to in paragraph 3;",
    },
    {
        label: "(i) processing is necessary for reasons of public interest in the area of public health, such as protecting against serious cross-border threats to health or ensuring high standards of quality and safety of health care and of medicinal products or medical devices, on the basis of Union or Member State law which provides for suitable and specific measures to safeguard the rights and freedoms of the data subject, in particular professional secrecy;",
        value: "(i) processing is necessary for reasons of public interest in the area of public health, such as protecting against serious cross-border threats to health or ensuring high standards of quality and safety of health care and of medicinal products or medical devices, on the basis of Union or Member State law which provides for suitable and specific measures to safeguard the rights and freedoms of the data subject, in particular professional secrecy;",
    },
    {
        label: "(j) processing is necessary for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes in accordance with Article 89(1) based on Union or Member State law which shall be proportionate to the aim pursued, respect the essence of the right to data protection and provide for suitable and specific measures to safeguard the fundamental rights and the interests of the data subject.",
        value: "(j) processing is necessary for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes in accordance with Article 89(1) based on Union or Member State law which shall be proportionate to the aim pursued, respect the essence of the right to data protection and provide for suitable and specific measures to safeguard the fundamental rights and the interests of the data subject.",
    },
];

const requestFrequencyList = [
    { label: "", value: "" },
    { label: "One-off", value: "One-off" },
    { label: "Recurring", value: "Recurring" },
];

const dutyOfConfidentialityList = [
    { label: "", value: "" },
    { label: "Not applicable", value: "Not applicable" },
    { label: "Consent", value: "Consent" },
    { label: "Section 251 NHS Act 2006", value: "Section 251 NHS Act 2006" },
    { label: "Other", value: "Other" },
];

const accessTypeList = [
    { label: "", value: "" },
    { label: "TRE", value: "TRE" },
    { label: "Release", value: "Release" },
];

const formFields = [
    {
        sectionName: "Safe People",
        fields: [
            {
                label: "Organisation name",
                name: "organisation_name",
                info: "The name of the legal entity that signs the contract to access the data",
                component: inputComponents.TextField,
            },
            {
                label: "Organisation ID (optional)",
                name: "organisation_id",
                info: "A unique identifier for an organisation that is preferably an industry used standard such as Grid.ac (see https://www.grid.ac/institutes)",
                component: inputComponents.TextField,
            },
            {
                label: "Organisation sector (optional)",
                name: "organisation_sector",
                info: "The type of organisation that has signed a contract to access the data",
                component: inputComponents.Select,
                options: organisationSectorList,
            },
            {
                label: "Applicant name(s) (optional)",
                name: "non_gateway_applicants",
                info: "The name of the Principal Investigator, as well as any other individuals that have been authorised to use the data. If they are on the Gateway, please provide their profile URL",
                component: inputComponents.Autocomplete,
                canCreate: true,
                multiple: true,
                options: [],
            },
            {
                label: "Applicant ID (optional)",
                name: "applicant_id",
                info: "ORCID identifier. This provides a persistent digital identifier that you own and control, and that distinguishes you from every other researcher. An ORCID profile can be created at https://orcid.org/",
                component: inputComponents.TextField,
            },
            {
                label: "Funders/Sponsor (optional)",
                name: "funders_and_sponsors",
                info: "The name of any funders or sponsors involved in the project",
                component: inputComponents.TextField,
            },
            {
                label: "DEA accredited researcher? (optional)",
                name: "accredited_researcher_status",
                info: "Depending on the type of data you are requesting, you might be required to become an accredited researcher. Most access to data in the Secure Research Service (SRS) will be by researchers accredited under the Digital Economy Act 2017 (DEA). This specifies the accreditation status of the principal applicant/researcher, as defined by the ONS Research Code of Practice and Accreditation criteria.",
                component: inputComponents.Select,
                options: yesNoList,
            },
            {
                label: "Sub-licence arrangements (if any)? (optional)",
                name: "sublicence_arrangements",
                info: "Identifies whether there are any permissions for the applicant to share the data beyond the named parties. e.g., NHS Digital may approve a data release to the ONS, who then makes decisions about access to accredited researchers undertaking approved projects in their own trusted research environment.",
                component: inputComponents.Select,
                options: yesNoList,
            },
        ],
    },
    {
        sectionName: "Safe Project",
        fields: [
            {
                label: "Project ID",
                name: "project_id_text",
                info: "A unique identifier for the project that is preferably an industry-used standard, such as IRAS ID. However, for non-research projects, a unique reference number created by the data custodian on receipt of the application is sufficient.",
                component: inputComponents.TextField,
                readOnly: true,
            },
            {
                label: "Project title",
                name: "project_title",
                info: "The title of the project/research study/request that the applicant is investigating through the use of health data",
                component: inputComponents.TextField,
            },
            {
                label: "Lay summary (optional)",
                name: "lay_summary",
                info: "A concise and clear description of the project (e.g., as required by URKI in funding applications). It should outline the problem, objectives, and expected outcomes in language that is understandable to the general public.",
                component: inputComponents.TextArea,
                limit: 3000,
            },
            {
                label: "Public benefit statement (optional)",
                name: "public_benefit_statement",
                info: "A description in plain English of the anticipated outcomes, or impact of project on the general public",
                component: inputComponents.TextArea,
            },
            {
                label: "Request category type (optional)",
                name: "request_category_type",
                info: "This categorises the 'purpose of the share' (i.e., research, policy development, etc)",
                component: inputComponents.Select,
                options: requestCategoryTypeList,
            },
            {
                label: "Technical summary (optional)",
                name: "technical_summary",
                info: "A summary of the proposed research, in a manner that is suitable for a specialist reader",
                component: inputComponents.TextArea,
            },
            {
                label: "Other approval committees (optional)",
                name: "other_approval_committees",
                info: "Reference to other decision-making bodies that the project has already been authorised by",
                component: inputComponents.TextField,
            },
            {
                label: "Project start date (optional)",
                name: "project_start_date",
                info: "The date the project is scheduled to start or actual start date",
                component: inputComponents.DatePicker,
            },
            {
                label: "Project end date (optional)",
                name: "project_end_date",
                info: "The date the project is scheduled to end or actual end date",
                component: inputComponents.DatePicker,
            },
            {
                label: "Latest approval date (optional)",
                name: "latest_approval_date",
                info: "The last date the data access request for this project was approved by a data custodian",
                component: inputComponents.DatePicker,
            },
        ],
    },
    {
        sectionName: "Safe Data",
        fields: [
            {
                label: "Dataset(s) name",
                name: "datasets",
                info: "The name of the dataset(s) being accessed",
                component: inputComponents.Autocomplete,
                disabled: true,
                multiple: true,
            },
            {
                label: "Data sensitivity level (optional)",
                name: "data_sensitivity_level",
                info: "The level of identifiability of the data being accessed, as defined by Understanding Patient Data",
                component: inputComponents.Select,
                options: dataSensitivityLevelList,
            },
            {
                label: "Legal basis for provision of data under Article 6 (optional)",
                name: "legal_basis_for_data_article6",
                info: "The lawful basis for processing is set out in Article 6 of the GDPR. At least one legal basis must apply whenever you process personal data. Please select an appropriate Article 6 lawful basis. Processing shall be lawful only if and to the extent that at least one of the following applies:",
                component: inputComponents.Select,
                options: legalBasisForDataArticle6List,
            },
            {
                label: "Lawful conditions for provision of data under Article 9 (optional)",
                name: "legal_basis_for_data_article9",
                info: "Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data for the purpose of uniquely identifying a natural person, data concerning health or data concerning a natural person's sex life or sexual orientation shall be prohibited. This does not apply if one of the following applies:",
                component: inputComponents.Select,
                options: legalBasisForDataArticle9List,
            },
            {
                label: "Common law of duty of confidentiality (optional)",
                name: "duty_of_confidentiality",
                info: "If confidential information is being disclosed, the organisations holding this data (both the organisation disclosing the information and the recipient organisation) must also have a lawful basis to hold and use this information, and if applicable, have a condition to hold and use special categories of confidential information, and be fair and transparent about how they hold and use this data. In England and Wales, if you are using section 251 of the NHS Act 2006 (s251) as a legal basis for identifiable data, you will need to ensure that you have the latest approval letter and application. For Scotland, this application will be reviewed by the Public Benefit and Privacy Panel. In Northern Ireland, it will be considered by the Privacy Advisory Committee. If you are using patient consent as the legal basis, you will need to provide all relevant consent forms and information leaflets.",
                component: inputComponents.Select,
                options: dutyOfConfidentialityList,
            },
            {
                label: "National data opt-out applied? (optional)",
                name: "national_data_optout",
                info: "Specifies whether the preference for people to opt-out of their confidential patient information being used for secondary use has been applied to the data prior to release.",
                component: inputComponents.Select,
                options: yesNoNotList,
            },
            {
                label: "Request frequency (optional)",
                name: "request_frequency",
                info: "Determines whether this a 'one-off' request or a recurring dataset to be provided over a specific time period",
                component: inputComponents.Select,
                options: requestFrequencyList,
            },
            {
                label: "For linked datasets, specify how the linkage will take place (optional)",
                name: "dataset_linkage_description",
                info: "Specifies whether the applicant intends for the datasets to be linked with any additional datasets. Relevant information on the organisations undertaking linkages and how the linkage will take place must also be disclosed, as well as a summary of the risks/mitigations to be considered.",
                component: inputComponents.TextArea,
            },
            {
                label: "Description of how the data will be used (optional)",
                name: "confidential_data_description",
                info: "A description of the specific patient identifiable fields that have been included in the dataset(s) being accessed",
                component: inputComponents.TextArea,
            },
            {
                label: "Release/Access date (optional)",
                name: "access_date",
                info: "The date the data access was granted and active research started",
                component: inputComponents.DatePicker,
            },
        ],
    },
    {
        sectionName: "Safe Settings",
        fields: [
            {
                label: "Access type (optional)",
                name: "access_type",
                info: "Determines whether the data will be accessed within a Trusted Research Environment (TRE) or via the traditional data release model.",
                component: inputComponents.Select,
                options: accessTypeList,
            },
            {
                label: "How has data been processed to enhance privacy? (optional)",
                name: "privacy_enhancements",
                info: "Description of the tools or software used to reduce level of identifiable data being shared",
                component: inputComponents.TextField,
            },
        ],
    },
    {
        sectionName: "Safe Output",
        fields: [
            {
                label: "Link to research outputs (optional)",
                name: "safeOutput",
                info: "A URL link to any academic or non-academic research outputs, as they become available, including code used. If the link is to a Gateway resource, this will automatically populate in related resources.",
                component: inputComponents.Autocomplete,
                // TODO - populate this list
                options: [],
                canCreate: true,
                multiple: true,
            },
        ],
    },
    {
        sectionName: "Keywords",
        fields: [
            {
                label: "Keywords (optional)",
                name: "keywords",
                info: "Select maximum 5 keywords that will help make your data use easily searchable",
                component: inputComponents.Autocomplete,
                options: [],
                canCreate: true,
                multiple: true,
            },
        ],
    },
    {
        sectionName: "Related resources",
        fields: [
            // TODO
        ],
    },
];

export {
    defaultValues as dataUseDefaultValues,
    validationSchema as dataUseValidationSchema,
    formFields as dataUseFormFields,
};
