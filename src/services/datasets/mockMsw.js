import { rest } from 'msw';
import { apiURL } from '../../configs/url.config';

export const mockNextInReviewDataset = {
    _id: '60929068c794e1288d4ec704',
    pid: 'd5c99a71-c039-4a0b-9171-dba8a1c33154',
    activeflag: 'inReview',
    datasetv2: {
        identifier: '',
        version: '',
        issued: '',
        modified: '',
        revisions: [],
        summary: {
            title: '',
            abstract:
                "The COVID Symptom Tracker was designed by doctors and scientists at King's College London (KCL), Guys and St Thomas’ Hospital working in partnership with ZOE Global. Led by Dr Tim Spector, professor of genetic epidemiology at KCL and director of TwinsUK.",
            publisher: {
                identifier: '',
                name: 'SAIL',
                logo: '',
                description: '',
                contactPoint: 'saildatabank@swansea.ac.uk',
                memberOf: 'ALLIANCE',
                accessRights: [],
                deliveryLeadTime: '',
                accessService: '',
                accessRequestCost: '',
                dataUseLimitation: [],
                dataUseRequirements: [],
            },
            contactPoint: 'saildatabank@swansea.ac.uk',
            keywords: ['COVID-19', 'TRACKER', 'SAIL', 'COVID', 'MOBILE APP', 'CORONAVIRUS', 'SYMPTOM', 'NCS', 'National Core Study'],
            alternateIdentifiers: [],
            doiName: 'In Progress',
        },
        documentation: {
            description: '',
            associatedMedia: ['https://saildatabank.com/about-us/overview/', 'https://covid.joinzoe.com/data'],
            isPartOf: 'NOT APPLICABLE',
        },
        coverage: {
            spatial: 'Great Britain',
            typicalAgeRange: '15-150',
            physicalSampleAvailability: ['NOT AVAILABLE'],
            followup: '0 - 6 MONTHS',
            pathway: 'Covid-19',
        },
        provenance: {
            origin: {
                purpose: 'DISEASE REGISTRY',
                source: 'OTHER',
                collectionSituation: 'HOME',
            },
            temporal: {
                accrualPeriodicity: 'DAILY',
                distributionReleaseDate: '2020-04-03',
                startDate: '2020-03-21',
                endDate: '2020-08-09',
                timeLag: 'NO TIMELAG',
            },
        },
        accessibility: {
            usage: {
                dataUseLimitation: 'GENERAL RESEARCH USE',
                dataUseRequirements: ['PROJECT SPECIFIC RESTRICTIONS', 'TIME LIMIT ON USE', 'USER SPECIFIC RESTRICTION'],
                resourceCreator:
                    "The COVID symptom tracker was created by doctors and scientists at King's College London, Guys and St Thomas’ Hospitals working in partnership with ZOE Global Ltd – a health science company.",
                investigations: ['https://saildatabank.com/saildata/projects-using-sail/'],
                isReferencedBy: ['D. A. Drew et al., Science 10.1126/science.abc0473 (2020)'],
            },
            access: {
                accessRights: ['https://saildatabank.com/application-process/two-stage-process/'],
                accessService:
                    'The SAIL Databank is powered by the UK Secure e-Research Platform (UKSeRP). Following approval through safeguard processes, access to project-specific data within the secure environment is permitted using two-factor authentication',
                accessRequestCost:
                    'Data provision is free from SAIL. Overall project costing depends on the number of people that require access to the SAIL Gateway, the activities that SAIL needs to complete (e.g. loading non-standard datasets), data refreshes, analytical work required, disclosure control process, and special case technological requirements.',
                deliveryLeadTime: '2-6 MONTHS',
                jurisdiction: 'GB-GBN',
                dataProcessor: 'SAIL Databank',
                dataController: 'Zoe Global Ltd (https://joinzoe.com/)',
            },
            formatAndStandards: {
                vocabularyEncodingScheme: 'LOCAL',
                conformsTo: 'LOCAL',
                language: 'en',
                format: ['CSV Tables'],
            },
        },
        enrichmentAndLinkage: {
            qualifiedRelation: ['Not Available'],
            derivation: ['Not Available'],
            tools: ['https://conceptlibrary.saildatabank.com/'],
        },
        observations: [],
    },
};

export const mockInReviewDataset = {
    _id: '60929068c794e1288d4ec704',
    pid: '0a048419-0796-46fb-ad7d-91e650a6c742',
    activeflag: 'inReview',
    datasetv2: {
        identifier: '',
        version: '',
        issued: '',
        modified: '',
        revisions: [],
        summary: {
            title: '',
            abstract:
                "The COVID Symptom Tracker was designed by doctors and scientists at King's College London (KCL), Guys and St Thomas’ Hospital working in partnership with ZOE Global. Led by Dr Tim Spector, professor of genetic epidemiology at KCL and director of TwinsUK.",
            publisher: {
                identifier: '',
                name: 'SAIL',
                logo: '',
                description: '',
                contactPoint: 'saildatabank@swansea.ac.uk',
                memberOf: 'ALLIANCE',
                accessRights: [],
                deliveryLeadTime: '',
                accessService: '',
                accessRequestCost: '',
                dataUseLimitation: [],
                dataUseRequirements: [],
            },
            contactPoint: 'saildatabank@swansea.ac.uk',
            keywords: ['COVID-19', 'TRACKER', 'SAIL', 'COVID', 'MOBILE APP', 'CORONAVIRUS', 'SYMPTOM', 'NCS', 'National Core Study'],
            alternateIdentifiers: [],
            doiName: 'In Progress',
        },
        documentation: {
            description: '',
            associatedMedia: ['https://saildatabank.com/about-us/overview/', 'https://covid.joinzoe.com/data'],
            isPartOf: 'NOT APPLICABLE',
        },
        coverage: {
            spatial: 'Great Britain',
            typicalAgeRange: '15-150',
            physicalSampleAvailability: ['NOT AVAILABLE'],
            followup: '0 - 6 MONTHS',
            pathway: 'Covid-19',
        },
        provenance: {
            origin: {
                purpose: 'DISEASE REGISTRY',
                source: 'OTHER',
                collectionSituation: 'HOME',
            },
            temporal: {
                accrualPeriodicity: 'DAILY',
                distributionReleaseDate: '2020-04-03',
                startDate: '2020-03-21',
                endDate: '2020-08-09',
                timeLag: 'NO TIMELAG',
            },
        },
        accessibility: {
            usage: {
                dataUseLimitation: 'GENERAL RESEARCH USE',
                dataUseRequirements: ['PROJECT SPECIFIC RESTRICTIONS', 'TIME LIMIT ON USE', 'USER SPECIFIC RESTRICTION'],
                resourceCreator:
                    "The COVID symptom tracker was created by doctors and scientists at King's College London, Guys and St Thomas’ Hospitals working in partnership with ZOE Global Ltd – a health science company.",
                investigations: ['https://saildatabank.com/saildata/projects-using-sail/'],
                isReferencedBy: ['D. A. Drew et al., Science 10.1126/science.abc0473 (2020)'],
            },
            access: {
                accessRights: ['https://saildatabank.com/application-process/two-stage-process/'],
                accessService:
                    'The SAIL Databank is powered by the UK Secure e-Research Platform (UKSeRP). Following approval through safeguard processes, access to project-specific data within the secure environment is permitted using two-factor authentication',
                accessRequestCost:
                    'Data provision is free from SAIL. Overall project costing depends on the number of people that require access to the SAIL Gateway, the activities that SAIL needs to complete (e.g. loading non-standard datasets), data refreshes, analytical work required, disclosure control process, and special case technological requirements.',
                deliveryLeadTime: '2-6 MONTHS',
                jurisdiction: 'GB-GBN',
                dataProcessor: 'SAIL Databank',
                dataController: 'Zoe Global Ltd (https://joinzoe.com/)',
            },
            formatAndStandards: {
                vocabularyEncodingScheme: 'LOCAL',
                conformsTo: 'LOCAL',
                language: 'en',
                format: ['CSV Tables'],
            },
        },
        enrichmentAndLinkage: {
            qualifiedRelation: ['Not Available'],
            derivation: ['Not Available'],
            tools: ['https://conceptlibrary.saildatabank.com/'],
        },
        observations: [],
    },
};

export const mockRejectedDataset = {
    _id: '60929068c794e1288d4ec704',
    type: 'dataset',
    name: 'COVID-19 Symptom Tracker Dataset',
    datasetv2: {
        identifier: '',
        version: '',
        issued: '',
        modified: '',
        revisions: [],
        summary: {
            title: '',
            abstract:
                "The COVID Symptom Tracker was designed by doctors and scientists at King's College London (KCL), Guys and St Thomas’ Hospital working in partnership with ZOE Global. Led by Dr Tim Spector, professor of genetic epidemiology at KCL and director of TwinsUK.",
            publisher: {
                identifier: '',
                name: 'SAIL',
                logo: '',
                description: '',
                contactPoint: 'saildatabank@swansea.ac.uk',
                memberOf: 'ALLIANCE',
                accessRights: [],
                deliveryLeadTime: '',
                accessService: '',
                accessRequestCost: '',
                dataUseLimitation: [],
                dataUseRequirements: [],
            },
            contactPoint: 'saildatabank@swansea.ac.uk',
            keywords: ['COVID-19', 'TRACKER', 'SAIL', 'COVID', 'MOBILE APP', 'CORONAVIRUS', 'SYMPTOM', 'NCS', 'National Core Study'],
            alternateIdentifiers: [],
            doiName: 'In Progress',
        },
        documentation: {
            description: '',
            associatedMedia: ['https://saildatabank.com/about-us/overview/', 'https://covid.joinzoe.com/data'],
            isPartOf: 'NOT APPLICABLE',
        },
        coverage: {
            spatial: 'Great Britain',
            typicalAgeRange: '15-150',
            physicalSampleAvailability: ['NOT AVAILABLE'],
            followup: '0 - 6 MONTHS',
            pathway: 'Covid-19',
        },
        provenance: {
            origin: {
                purpose: 'DISEASE REGISTRY',
                source: 'OTHER',
                collectionSituation: 'HOME',
            },
            temporal: {
                accrualPeriodicity: 'DAILY',
                distributionReleaseDate: '2020-04-03',
                startDate: '2020-03-21',
                endDate: '2020-08-09',
                timeLag: 'NO TIMELAG',
            },
        },
        accessibility: {
            usage: {
                dataUseLimitation: 'GENERAL RESEARCH USE',
                dataUseRequirements: ['PROJECT SPECIFIC RESTRICTIONS', 'TIME LIMIT ON USE', 'USER SPECIFIC RESTRICTION'],
                resourceCreator:
                    "The COVID symptom tracker was created by doctors and scientists at King's College London, Guys and St Thomas’ Hospitals working in partnership with ZOE Global Ltd – a health science company.",
                investigations: ['https://saildatabank.com/saildata/projects-using-sail/'],
                isReferencedBy: ['D. A. Drew et al., Science 10.1126/science.abc0473 (2020)'],
            },
            access: {
                accessRights: ['https://saildatabank.com/application-process/two-stage-process/'],
                accessService:
                    'The SAIL Databank is powered by the UK Secure e-Research Platform (UKSeRP). Following approval through safeguard processes, access to project-specific data within the secure environment is permitted using two-factor authentication',
                accessRequestCost:
                    'Data provision is free from SAIL. Overall project costing depends on the number of people that require access to the SAIL Gateway, the activities that SAIL needs to complete (e.g. loading non-standard datasets), data refreshes, analytical work required, disclosure control process, and special case technological requirements.',
                deliveryLeadTime: '2-6 MONTHS',
                jurisdiction: 'GB-GBN',
                dataProcessor: 'SAIL Databank',
                dataController: 'Zoe Global Ltd (https://joinzoe.com/)',
            },
            formatAndStandards: {
                vocabularyEncodingScheme: 'LOCAL',
                conformsTo: 'LOCAL',
                language: 'en',
                format: ['CSV Tables'],
            },
        },
        enrichmentAndLinkage: {
            qualifiedRelation: ['Not Available'],
            derivation: ['Not Available'],
            tools: ['https://conceptlibrary.saildatabank.com/'],
        },
        observations: [],
    },
    pid: '1f509fe7-e94f-48fe-af6a-81f2bf8a5270',
    activeflag: 'rejected',
};

export const mswGetInReviewDataset = rest.get(`${apiURL}/datasets/0a048419-0796-46fb-ad7d-91e650a6c742`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            data: mockInReviewDataset,
        })
    );
});

export const mswGetNextInReviewDataset = rest.get(`${apiURL}/datasets/d5c99a71-c039-4a0b-9171-dba8a1c33154`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            data: mockNextInReviewDataset,
        })
    );
});

export const mswGetRejectedDataset = rest.get(`${apiURL}/datasets/1f509fe7-e94f-48fe-af6a-81f2bf8a5270`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            data: mockRejectedDataset,
        })
    );
});

export const mswGetInvalidDataset = rest.get(`${apiURL}/datasets/invalid`, (req, res, ctx) => {
    return res(ctx.status(404));
});

export default [mswGetInReviewDataset, mswGetNextInReviewDataset, mswGetRejectedDataset, mswGetInvalidDataset];
