const dataUseSchema = {
	'Project Title*': {
		prop: 'projectTitle',
		type: String,
		required: true,
	},
	'Project ID': {
		prop: 'projectIdText',
		type: String,
	},
	'Dataset(s) Name*': {
		prop: 'datasetNames',
		type: String,
		required: true,
	},
	'Organisation Name*': {
		prop: 'organisationName',
		type: String,
		required: true,
	},
	'Organisation ID': {
		prop: 'organisationId',
		type: String,
	},
	'Organisation Sector': {
		prop: 'organisationSector',
		type: String,
	},
	'Applicant Name(s)': {
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
	'Accredited Researcher Status': {
		prop: 'accreditedResearcherStatus',
		type: String,
	},
	'Sub-Licence Arrangements (if any)?': {
		prop: 'sublicenceArrangements',
		type: String,
	},

	'Lay Summary*': {
		prop: 'laySummary',
		type: String,
		required: true,
	},

	'Public Benefit Statement': {
		prop: 'publicBenefitStatement',
		type: String,
	},

	'Request Category Type': {
		prop: 'requestCategoryType',
		type: String,
	},

	'Technical Summary': {
		prop: 'technicalSummary',
		type: String,
	},

	'Other Approval Committees': {
		prop: 'otherApprovalCommittees',
		type: String,
	},

	'Project Start Date': {
		prop: 'projectStartDate',
		type: Date,
	},

	'Project End Date': {
		prop: 'projectEndDate',
		type: Date,
	},

	'Latest Approval Date*': {
		prop: 'latestApprovalDate',
		type: Date,
		required: true,
	},

	'Data Sensitivity Level': {
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

	'National Data Opt-out applied?': {
		prop: 'nationalDataOptOut',
		type: String,
	},

	'Request Frequency': {
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

	'Release/Access Date': {
		prop: 'accessDate',
		type: Date,
	},

	'TRE or any other specified location*': {
		prop: 'dataLocation',
		type: String,
		required: true,
	},

	'How has data been processed to enhance privacy?': {
		prop: 'privacyEnhancements',
		type: String,
	},

	'Link to Research Outputs': {
		prop: 'researchOutputs',
		type: String,
	},
};

export default dataUseSchema;