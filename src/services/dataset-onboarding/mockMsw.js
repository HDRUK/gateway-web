import { rest } from 'msw';
import { apiURL } from '../../configs/url.config';

export const mockGetPublisher = {
    success: true,
    data: {
        publisherTotals: {
            inReview: 19,
        },
        results: {
            total: 19,
            listOfDatasets: [
                {
                    _id: '6183d32d52ef7eafc3c5793e',
                    timestamps: {
                        created: '2021-11-04T12:33:49.680Z',
                        updated: '2021-11-04T13:59:45.084Z',
                        submitted: '2021-11-04T13:59:45.084Z',
                    },
                    pid: 'adc28a1e-f7e2-41d0-92e6-b9e4c11f9f1a',
                    datasetVersion: '7.0.0',
                    name: 'Test title x',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'draft',
                    percentageCompleted: {
                        summary: 80,
                        documentation: 0,
                        coverage: 0,
                        origin: 33,
                        temporal: 60,
                        usage: 0,
                        access: 43,
                        formatAndStandards: 100,
                        enrichmentAndLinkage: 0,
                        observations: 80,
                        provenance: 50,
                        accessibility: 44,
                        structural: 0,
                    },
                    listOfVersions: [
                        {
                            _id: '6131ff4191fd6787f314804f',
                            datasetVersion: '6.0.0',
                            activeflag: 'active',
                        },
                        {
                            _id: '6131f0fe09f00b84671b2eb6',
                            datasetVersion: '5.0.0',
                            activeflag: 'active',
                        },
                        {
                            _id: '6130f09c05936d4236c42de7',
                            datasetVersion: '4.0.0',
                            activeflag: 'rejected',
                        },
                        {
                            _id: '6130efd505936d4236c42de1',
                            datasetVersion: '3.0.0',
                            activeflag: 'archive',
                        },
                        {
                            _id: '6130e33805936d4236c42dd5',
                            datasetVersion: '2.0.0',
                            activeflag: 'rejected',
                        },
                        {
                            _id: '6130d0ed05936d4236c42dcc',
                            datasetVersion: '1.0.0',
                            activeflag: 'archive',
                        },
                    ],
                },
                {
                    _id: '6183c20aa3713daa9369497d',
                    timestamps: {
                        created: '2021-11-02T15:55:52.514Z',
                        updated: '2021-11-04T11:20:56.828Z',
                        submitted: '2021-11-04T11:20:56.828Z',
                        published: '2021-11-03T14:02:06.377Z',
                    },
                    pid: '0a048419-0796-46fb-ad7d-91e650a6c742',
                    datasetVersion: '2',
                    name: 'ActivityLog Test - CR',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'inReview',
                    percentageCompleted: {
                        summary: 80,
                        documentation: 0,
                        coverage: 0,
                        origin: 0,
                        temporal: 60,
                        usage: 0,
                        access: 57,
                        formatAndStandards: 100,
                        enrichmentAndLinkage: 0,
                        observations: 80,
                        provenance: 38,
                        accessibility: 50,
                        structural: 0,
                    },
                    applicationStatusDesc: 'This dataset is pro',
                    listOfVersions: [
                        {
                            _id: '6130f09c05936d4236c42de7',
                            datasetVersion: '4.0.0',
                            activeflag: 'rejected',
                        },
                        {
                            _id: '6130efd505936d4236c42de1',
                            datasetVersion: '3.0.0',
                            activeflag: 'archive',
                        },
                        {
                            _id: '6130e33805936d4236c42dd5',
                            datasetVersion: '2.0.0',
                            activeflag: 'rejected',
                        },
                        {
                            _id: '6130d0ed05936d4236c42dcc',
                            datasetVersion: '1.0.0',
                            activeflag: 'archive',
                        },
                    ],
                },
                {
                    _id: '61829ed64bab049816c57b02',
                    timestamps: {
                        created: '2021-11-03T14:18:33.591Z',
                        updated: '2021-11-03T14:39:40.005Z',
                        submitted: '2021-11-03T14:39:01.328Z',
                        published: '2021-11-03T14:20:10.314Z',
                        rejected: '2021-11-03T14:39:40.005Z',
                    },
                    pid: '1f509fe7-e94f-48fe-af6a-81f2bf8a5270',
                    datasetVersion: '1.0.0',
                    name: 'ActivityLog Test Flow Question-diff',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'rejected',
                    percentageCompleted: {
                        summary: 80,
                        documentation: 0,
                        coverage: 0,
                        origin: 0,
                        temporal: 60,
                        usage: 0,
                        access: 57,
                        formatAndStandards: 100,
                        enrichmentAndLinkage: 0,
                        observations: 80,
                        provenance: 38,
                        accessibility: 50,
                        structural: 0,
                    },
                    applicationStatusDesc: 'SDg',
                    applicationStatusAuthor: 'Callum Reekie',
                    listOfVersions: [
                        {
                            _id: '6130f09c05936d4236c42de7',
                            datasetVersion: '4.0.0',
                            activeflag: 'rejected',
                        },
                        {
                            _id: '6130efd505936d4236c42de1',
                            datasetVersion: '3.0.0',
                            activeflag: 'archive',
                        },
                        {
                            _id: '6130e33805936d4236c42dd5',
                            datasetVersion: '2.0.0',
                            activeflag: 'rejected',
                        },
                        {
                            _id: '6130d0ed05936d4236c42dcc',
                            datasetVersion: '1.0.0',
                            activeflag: 'archive',
                        },
                    ],
                },
                {
                    _id: '61829910e4ea0f9763bd3e42',
                    timestamps: {
                        created: '2021-11-02T15:55:52.514Z',
                        updated: '2021-11-03T14:15:29.942Z',
                        submitted: '2021-11-03T14:14:15.231Z',
                        published: '2021-11-03T14:02:06.377Z',
                        rejected: '2021-11-03T14:15:29.942Z',
                    },
                    pid: '2af96d00-fc49-41e9-a1d1-fa6341802540',
                    datasetVersion: '1.0.0',
                    name: 'ActivityLog Test Flow',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'rejected',
                    percentageCompleted: {
                        summary: 80,
                        documentation: 0,
                        coverage: 0,
                        origin: 0,
                        temporal: 60,
                        usage: 0,
                        access: 57,
                        formatAndStandards: 100,
                        enrichmentAndLinkage: 0,
                        observations: 80,
                        provenance: 38,
                        accessibility: 50,
                        structural: 0,
                    },
                    applicationStatusDesc: 'You have not done something right.',
                    applicationStatusAuthor: 'Callum Reekie',
                    listOfVersions: [
                        {
                            _id: '6130f09c05936d4236c42de7',
                            datasetVersion: '4.0.0',
                            activeflag: 'rejected',
                        },
                        {
                            _id: '6130efd505936d4236c42de1',
                            datasetVersion: '3.0.0',
                            activeflag: 'archive',
                        },
                        {
                            _id: '6130e33805936d4236c42dd5',
                            datasetVersion: '2.0.0',
                            activeflag: 'rejected',
                        },
                        {
                            _id: '6130d0ed05936d4236c42dcc',
                            datasetVersion: '1.0.0',
                            activeflag: 'archive',
                        },
                    ],
                },
                {
                    _id: '61814af9f5fc00806ec17370',
                    timestamps: {
                        created: '2021-11-02T14:28:09.485Z',
                        updated: '2021-11-03T14:04:28.225Z',
                        submitted: '2021-11-02T14:30:44.286Z',
                        published: '2021-11-03T14:04:28.225Z',
                    },
                    pid: 'a9923649-38fe-4b28-90a1-e6de5fa5d405',
                    datasetVersion: '1.0.0',
                    name: 'ActivityLog Test',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'active',
                    percentageCompleted: {
                        summary: 80,
                        documentation: 67,
                        coverage: 0,
                        origin: 0,
                        temporal: 0,
                        usage: 0,
                        access: 0,
                        formatAndStandards: 0,
                        enrichmentAndLinkage: 0,
                        observations: 0,
                        provenance: 0,
                        accessibility: 0,
                        structural: 0,
                    },
                    applicationStatusDesc: 'This is the best',
                    listOfVersions: [],
                },
                {
                    _id: '618259995513698b28effdb8',
                    timestamps: {
                        created: '2021-11-02T15:55:52.514Z',
                        updated: '2021-11-03T14:02:06.377Z',
                        submitted: '2021-11-03T14:01:14.363Z',
                        published: '2021-11-03T14:02:06.377Z',
                    },
                    pid: 'ac46bdcd-150b-4e9f-a599-5efbb3f02c38',
                    datasetVersion: '1.0.0',
                    name: 'ActivityLog Test Dataset-duplicate',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'active',
                    percentageCompleted: {
                        summary: 80,
                        documentation: 0,
                        coverage: 0,
                        origin: 0,
                        temporal: 60,
                        usage: 0,
                        access: 57,
                        formatAndStandards: 100,
                        enrichmentAndLinkage: 0,
                        observations: 80,
                        provenance: 38,
                        accessibility: 50,
                        structural: 0,
                    },
                    applicationStatusDesc: 'This dataset is pro',
                    listOfVersions: [],
                },
                {
                    _id: '61815f8809cbd18331a66b68',
                    timestamps: {
                        created: '2021-11-02T15:55:52.514Z',
                        updated: '2021-11-03T13:41:33.422Z',
                        submitted: '2021-11-02T15:55:58.534Z',
                        rejected: '2021-11-03T10:35:34.734Z',
                        published: '2021-11-03T13:33:50.931Z',
                        archived: '2021-11-03T13:41:33.422Z',
                    },
                    pid: 'aa6898e8-7338-45bf-ae7b-7cc90c24df7e',
                    datasetVersion: '3.0.0',
                    name: 'ActivityLog Test Dataset',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'archive',
                    percentageCompleted: {
                        summary: 80,
                        documentation: 0,
                        coverage: 0,
                        origin: 0,
                        temporal: 60,
                        usage: 0,
                        access: 57,
                        formatAndStandards: 100,
                        enrichmentAndLinkage: 0,
                        observations: 80,
                        provenance: 38,
                        accessibility: 50,
                        structural: 0,
                    },
                    applicationStatusAuthor: 'Callum Reekie',
                    applicationStatusDesc: '',
                    listOfVersions: [
                        {
                            _id: '61815480f5fc00806ec1783b',
                            datasetVersion: '2.0.0',
                            activeflag: 'archive',
                        },
                        {
                            _id: '61814e3ef5fc00806ec175e9',
                            datasetVersion: '1.0.0',
                            activeflag: 'rejected',
                        },
                    ],
                },
                {
                    _id: '61814d82f5fc00806ec174c1',
                    timestamps: {
                        created: '2021-11-02T14:38:58.803Z',
                        updated: '2021-11-02T14:38:58.803Z',
                    },
                    pid: 'fd9d9bf3-576b-4efa-89fc-b389d524d667',
                    datasetVersion: '1.0.0',
                    name: 'New dataset 2 Nov 2021 14:38',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'draft',
                    listOfVersions: [],
                },
                {
                    _id: '618128a2c312ff5648a20850',
                    timestamps: {
                        created: '2021-11-02T12:01:38.853Z',
                        updated: '2021-11-02T12:13:05.304Z',
                        submitted: '2021-11-02T12:13:05.304Z',
                    },
                    pid: 'd5c99a71-c039-4a0b-9171-dba8a1c33154',
                    datasetVersion: '2.0.0',
                    name: 'New dataset 2 Nov 2021 12:01',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'inReview',
                    percentageCompleted: {
                        summary: 100,
                        documentation: 0,
                        coverage: 0,
                        origin: 0,
                        temporal: 100,
                        usage: 0,
                        access: 100,
                        formatAndStandards: 100,
                        enrichmentAndLinkage: 100,
                        observations: 100,
                        provenance: 63,
                        accessibility: 69,
                        structural: 0,
                    },
                    listOfVersions: [],
                },
                {
                    _id: '616ff5289d214248d2d6bb1f',
                    timestamps: {
                        created: '2021-10-20T10:53:28.502Z',
                        updated: '2021-10-20T10:53:28.503Z',
                    },
                    pid: '4932179f-1c9c-40a0-81b5-9b499aff7a64',
                    datasetVersion: '2',
                    name: 'New dataset 20 Oct 2021 11:53',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'inReview',
                    listOfVersions: [],
                },
                {
                    _id: '6165acf08259476c7c5dbb45',
                    timestamps: {
                        created: '2021-10-12T15:42:40.271Z',
                        updated: '2021-10-12T15:42:40.271Z',
                    },
                    pid: 'fd503550-2e92-4dd7-95e7-a6b4b9efc327',
                    datasetVersion: '1.0.0',
                    name: 'New dataset 12 Oct 2021 16:42',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'draft',
                    listOfVersions: [],
                },
                {
                    _id: '615dca4612358ae33e476d85',
                    timestamps: {
                        created: '2021-10-06T16:09:42.295Z',
                        updated: '2021-10-06T16:09:42.295Z',
                    },
                    pid: '19cebaf7-89e5-4dd8-987e-ea91235be143',
                    datasetVersion: '1.0.0',
                    name: 'New dataset 6 Oct 2021 17:09',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'draft',
                    listOfVersions: [],
                },
                {
                    _id: '61543fc29273913a14c050aa',
                    timestamps: {
                        created: '2021-09-29T10:28:18.823Z',
                        updated: '2021-09-29T10:28:18.823Z',
                    },
                    pid: '08d13a0c-be9d-410f-9cfb-6e4ef8c852c5',
                    datasetVersion: '1.0.0',
                    name: 'New dataset 29 Sep 2021 11:28',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'draft',
                    listOfVersions: [],
                },
                {
                    _id: '6130edba05936d4236c42ddb',
                    timestamps: {
                        created: '2021-09-02T15:28:58.309Z',
                        updated: '2021-09-29T09:30:18.270Z',
                        submitted: '2021-09-02T15:32:18.995Z',
                    },
                    pid: 'e6cd7563-67e7-47bf-ad7d-001cf5795db5',
                    datasetVersion: '1.0.0',
                    name: 'New dataset 2 Sep 2021 16:28',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'inReview',
                    percentageCompleted: {
                        summary: 20,
                        documentation: 0,
                        coverage: 0,
                        origin: 0,
                        temporal: 0,
                        usage: 0,
                        access: 0,
                        formatAndStandards: 0,
                        enrichmentAndLinkage: 0,
                        observations: 0,
                        provenance: 0,
                        accessibility: 0,
                        structural: 0,
                    },
                    listOfVersions: [],
                },
                {
                    _id: '61541f52d8a8436756c61902',
                    timestamps: {
                        created: '2021-09-29T08:09:54.400Z',
                        updated: '2021-09-29T08:09:54.400Z',
                    },
                    pid: 'bf2e98cb-8cac-4e74-bc53-e7ec53d8c404',
                    datasetVersion: '1.0.0',
                    name: 'New dataset 29 Sep 2021 09:09',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'draft',
                    listOfVersions: [],
                },
                {
                    _id: '61541ec4d8a8436756c618c3',
                    timestamps: {
                        created: '2021-09-29T08:07:32.978Z',
                        updated: '2021-09-29T08:07:32.978Z',
                    },
                    pid: 'ab99be06-e6e4-4fd8-9653-b0a4d200ee31',
                    datasetVersion: '1.0.0',
                    name: 'New dataset 29 Sep 2021 09:07',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'draft',
                    listOfVersions: [],
                },
                {
                    _id: '613a0b87d14f4ae6440a629e',
                    timestamps: {
                        created: '2021-09-09T13:26:31.642Z',
                        updated: '2021-09-28T14:09:32.344Z',
                        submitted: '2021-09-22T14:46:02.823Z',
                    },
                    pid: 'ab3309f7-5b2b-43a0-a84c-0281fd712e92',
                    datasetVersion: '1.0.0',
                    name: 'New dataset 9 Sep 2021 14:26',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'inReview',
                    percentageCompleted: {
                        summary: 80,
                        documentation: 0,
                        coverage: 0,
                        origin: 0,
                        temporal: 60,
                        usage: 0,
                        access: 43,
                        formatAndStandards: 100,
                        enrichmentAndLinkage: 0,
                        observations: 80,
                        provenance: 38,
                        accessibility: 44,
                        structural: 0,
                    },
                    listOfVersions: [],
                },
                {
                    _id: '614d9115940959a9d9c8d15a',
                    timestamps: {
                        created: '2021-09-24T08:49:25.850Z',
                        updated: '2021-09-24T08:49:25.851Z',
                    },
                    pid: '1f240dfb-61cc-465e-a6d8-74622754af68',
                    datasetVersion: '1.0.0',
                    name: 'New dataset 24 Sep 2021 09:49',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'draft',
                    listOfVersions: [],
                },
                {
                    _id: '6132190a91fd6787f314805a',
                    timestamps: {
                        created: '2021-09-03T12:46:02.945Z',
                        updated: '2021-09-03T12:51:10.627Z',
                        submitted: '2021-09-03T12:48:57.463Z',
                        rejected: '2021-09-03T12:51:10.627Z',
                    },
                    pid: 'be84d53b-b5b9-4687-93a4-33aa9e8cb4c8',
                    datasetVersion: '1.0.0',
                    name: 'Callum new SAIL',
                    datasetv2: {
                        summary: {
                            publisher: {
                                name: 'SAIL',
                            },
                        },
                    },
                    activeflag: 'rejected',
                    percentageCompleted: {
                        summary: 80,
                        documentation: 0,
                        coverage: 0,
                        origin: 0,
                        temporal: 60,
                        usage: 0,
                        access: 43,
                        formatAndStandards: 100,
                        enrichmentAndLinkage: 0,
                        observations: 100,
                        provenance: 38,
                        accessibility: 44,
                        structural: 0,
                    },
                    applicationStatusAuthor: 'Callum Reekie',
                    applicationStatusDesc: 'This isnae good enough!',
                    listOfVersions: [],
                },
            ],
        },
    },
};

export const mockPostDataset = {
    data: {
        id: '5f3f98068af2ef61552e1d75',
    },
};

export const mswGetPublisher = rest.get(`${apiURL}/dataset-onboarding/publisher/applicant`, (req, res, ctx) => {
    const search = req.url.searchParams.get('search');
    const sortBy = req.url.searchParams.get('sortBy');

    if (search && sortBy) {
        return res(
            ctx.status(200),
            ctx.json({
                ...mockGetPublisher,
                data: {
                    ...mockGetPublisher.data,
                    listOfDatasets: [mockGetPublisher.data.listOfDatasets[0]],
                },
            })
        );
    }

    return res(ctx.status(200), ctx.json(mockGetPublisher));
});

export const mswGetPublisher404 = rest.get(`${apiURL}/dataset-onboarding/publisher/unknown`, (req, res, ctx) => {
    return res(ctx.status(404));
});

export const mswPostDataset = rest.post(`${apiURL}/dataset-onboarding`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockPostDataset));
});

export default [mswPostDataset, mswGetPublisher, mswGetPublisher404];
