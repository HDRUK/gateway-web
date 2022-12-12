export default {
    version: 'Version 2.0.0',
    versionNumber: 2,
    applicationStatus: 'active',
    meta: {
        dateSubmitted: '2021-11-08T14:49:41.225Z',
        dateCreated: '2021-11-08T14:39:43.513Z',
        applicationStatus: 'active',
    },
    events: [
        {
            _id: '61893936df1feefcdd2b7939',
            eventType: 'datasetVersionApproved',
            logType: 'dataset',
            timestamp: '2021-11-08T14:50:30.646Z',
            user: '611cfb5a19d737331dad4aff',
            userDetails: {
                firstName: 'Callum',
                lastName: 'Reekie',
                role: 'admin',
            },
            version: '2.0.0',
            versionId: '618936afe87de1fbd16d1135',
            userTypes: ['admin', 'custodian'],
            adminComment: 'Approved with minor changes!',
            __v: 0,
        },
        {
            _id: '61893936df1feefcdd2b792c',
            eventType: 'datasetUpdatesSubmitted',
            logType: 'dataset',
            timestamp: '2021-11-08T14:50:30.566Z',
            user: '611cfb5a19d737331dad4aff',
            userDetails: {
                firstName: 'Callum',
                lastName: 'Reekie',
                role: 'admin',
            },
            version: '2.0.0',
            versionId: '618936afe87de1fbd16d1135',
            userTypes: ['admin', 'custodian'],
            datasetUpdates: [
                {
                    'summary/abstract': {
                        previousAnswer: 'test',
                        updatedAnswer: 'I have changed the abstract!',
                    },
                },
                {
                    'provenance/temporal/distributionReleaseDate': {
                        previousAnswer: '',
                        updatedAnswer: '02/11/2021',
                    },
                },
            ],
            __v: 0,
        },
        {
            _id: '61893905df1feefcdd2b78b8',
            eventType: 'newDatasetVersionSubmitted',
            logType: 'dataset',
            timestamp: '2021-11-08T14:49:41.380Z',
            user: '616993c3034a7d773064e208',
            userDetails: {
                firstName: 'Callum',
                lastName: 'Reekie',
                role: 'custodian',
            },
            version: '2.0.0',
            versionId: '618936afe87de1fbd16d1135',
            userTypes: ['admin', 'custodian'],
            __v: 0,
        },
    ],
};
