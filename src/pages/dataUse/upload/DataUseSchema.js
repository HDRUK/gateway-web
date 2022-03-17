const dataUseSchema = {
    'Project title*': {
        prop: 'projectTitle',
        type: String,
        required: true,
    },
    'Project ID': {
        prop: 'projectIdText',
        type: String,
    },
    'Dataset(s) name*': {
        prop: 'datasetNames',
        type: String,
        required: true,
    },
    'Organisation name*': {
        prop: 'organisationName',
        type: String,
        required: true,
    },
    'Organisation ID': {
        prop: 'organisationId',
        type: String,
    },
    'Organisation sector': {
        prop: 'organisationSector',
        type: String,
    },
    'Applicant name(s)': {
        prop: 'applicantNames',
        type: String,
    },
    'Applicant ID': {
        prop: 'applicantId',
        type: String,
    },
    'Funders/ Sponsors': {
        prop: 'fundersAndSponsors',
        type: String,
    },
    'DEA accredited researcher?': {
        prop: 'accreditedResearcherStatus',
        type: String,
    },
    'Sub-licence arrangements (if any)?': {
        prop: 'sublicenceArrangements',
        type: String,
    },

    'Lay summary*': {
        prop: 'laySummary',
        type: String,
    },

    'Public benefit statement*': {
        prop: 'publicBenefitStatement',
        type: String,
    },

    'Request category type': {
        prop: 'requestCategoryType',
        type: String,
    },

    'Technical summary': {
        prop: 'technicalSummary',
        type: String,
    },

    'Other approval committees': {
        prop: 'otherApprovalCommittees',
        type: String,
    },

    'Project start date': {
        prop: 'projectStartDate',
        type: Date,
    },

    'Project end date': {
        prop: 'projectEndDate',
        type: Date,
    },

    'Latest approval date*': {
        prop: 'latestApprovalDate',
        type: Date,
    },

    'Data sensitivity level': {
        prop: 'dataSensitivityLevel',
        type: String,
    },

    'Legal basis for provision of data under Article 6': {
        prop: 'legalBasisForDataArticle6',
        type: String,
    },

    'Lawful conditions for provision of data under Article 9': {
        prop: 'legalBasisForDataArticle9',
        type: String,
    },

    'Common Law Duty of Confidentiality': {
        prop: 'dutyOfConfidentiality',
        type: String,
    },

    'National data opt-out applied?': {
        prop: 'nationalDataOptOut',
        type: String,
    },

    'Request frequency': {
        prop: 'requestFrequency',
        type: String,
    },

    'For linked datasets, specify how the linkage will take place': {
        prop: 'datasetLinkageDescription',
        type: String,
    },

    'Description of the confidential data being used': {
        prop: 'confidentialDataDescription',
        type: String,
    },

    'Release/Access date': {
        prop: 'accessDate',
        type: Date,
    },

    'Access type*': {
        prop: 'accessType',
        type: String,
    },

    'How has data been processed to enhance privacy?': {
        prop: 'privacyEnhancements',
        type: String,
    },

    'Link to research outputs': {
        prop: 'researchOutputs',
        type: String,
    },
};

export default dataUseSchema;
