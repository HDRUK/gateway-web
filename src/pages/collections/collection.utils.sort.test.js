import { format } from 'date-fns';
import { sortByMetadataQuality, sortByRecentlyAdded, sortByResources, sortByPopularity } from './collection.utils.sort';

describe('Given the sortByMetadataQuality method', () => {
    describe('When the data has a metadata quality score', () => {
        test('Then the data should be sorted by the metadata quality score', () => {
            const data = [
                {
                    datasetfields: {
                        metadataquality: {
                            quality_score: 50,
                        },
                    },
                },
                {
                    datasetfields: {
                        metadataquality: {
                            quality_score: 100,
                        },
                    },
                },
            ];

            sortByMetadataQuality(data);

            const sortedData = [
                {
                    datasetfields: {
                        metadataquality: {
                            quality_score: 100,
                        },
                    },
                },
                {
                    datasetfields: {
                        metadataquality: {
                            quality_score: 50,
                        },
                    },
                },
            ];

            expect(data).toEqual(sortedData);
        });
    });

    describe('When the data does not have a metadata quality score', () => {
        test('Then the data should not be sorted', () => {
            const data = [{ field: 1 }, { field: 2 }];

            sortByMetadataQuality(data);

            const sortedData = [{ field: 1 }, { field: 2 }];

            expect(data).toEqual(sortedData);
        });
    });
});

describe('Given the sortByRecentlyAdded method', () => {
    test('Then the data should be sorted by the updated field', () => {
        const data = [{ updated: format(new Date(2020, 2, 1), 'dd/MM/yyyy') }, { updated: format(new Date(2019, 2, 1), 'dd/MM/yyyy') }];

        sortByRecentlyAdded(data);

        const sortedData = [
            { updated: format(new Date(2020, 2, 1), 'dd/MM/yyyy') },
            { updated: format(new Date(2019, 2, 1), 'dd/MM/yyyy') },
        ];

        expect(data).toEqual(sortedData);
    });
});

describe('Given the sortByResources method', () => {
    test('Then the data should be sorted by the relatedresources field', () => {
        const data = [{ relatedresources: 'abacus' }, { relatedresources: 'decimus' }];

        sortByResources(data);

        const sortedData = [{ relatedresources: 'abacus' }, { relatedresources: 'decimus' }];

        expect(data).toEqual(sortedData);
    });
});

describe('Given the sortByPopularity method', () => {
    test('Then the data should be sorted by the counter field', () => {
        const data = [{ counter: 50 }, { counter: 1000 }];

        sortByPopularity(data);

        const sortedData = [{ counter: 1000 }, { counter: 50 }];

        expect(data).toEqual(sortedData);
    });
});
