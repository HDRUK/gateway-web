import { faker } from '@faker-js/faker';

faker.seed(5);

const generateMockPublisherV1 = (data = {}) => {
    return {
        success: true,
        publisher: {
            dataRequestModalContent: {
                header: '',
                body: faker.lorem.sentence(),
                footer: '',
            },
            publisherDetails: {
                dataUse: {
                    widget: {
                        enabled: faker.datatype.boolean(),
                        accepted: faker.datatype.boolean(),
                        acceptedByUserId: faker.random.numeric(16),
                        acceptedDate: faker.date.between(),
                    },
                },
                questionBank: {
                    enabled: faker.datatype.boolean(),
                },
                accessRights: [],
                dataUseLimitation: [],
                dataUseRequirements: [],
                memberOf: faker.random.words(1),
                name: faker.random.words(5),
                dar: {
                    messageOnlySharing: {
                        enabled: faker.datatype.boolean(),
                    },
                },
                contactPoint: '',
            },
            federation: {
                active: faker.datatype.boolean(),
            },
            active: faker.datatype.boolean(),
            allowsMessaging: faker.datatype.boolean(),
            workflowEnabled: faker.datatype.boolean(),
            allowAccessRequestManagement: faker.datatype.boolean(),
            uses5Safes: faker.datatype.boolean(),
            _id: faker.random.alphaNumeric(25),
            name: faker.random.words(5),
            imageURL: '',
            dataRequestModalContentUpdatedBy: 5385077600698822,
            dataRequestModalContentUpdatedOn: faker.date.between(),
            mdcFolderId: faker.random.alphaNumeric(25),
            'dar-integration': {
                enabled: faker.datatype.boolean(),
                notificationEmail: [],
                outbound: {
                    auth: {
                        type: faker.random.alpha(20),
                        secrets_key: faker.random.alpha(30),
                    },
                    endpoints: {
                        baseURL: faker.internet.url(),
                        enquiry: faker.internet.url(),
                        '5Safes': faker.internet.url(),
                        '5SafesFiles': faker.internet.url(),
                    },
                },
                inbound: {
                    serviceAccountID: '',
                },
            },
            applicationFormUpdatedBy: 6878418568959561,
            applicationFormUpdatedOn: faker.date.between(),
        },

        ...data,
    };
};

export { generateMockPublisherV1 };
