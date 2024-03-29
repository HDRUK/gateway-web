import { render, screen } from '@testing-library/react';
import DatasetCollectionResults from './index';
import * as service from '../../../../services/related-objects';

jest.mock('../../../../services/related-objects', () => ({ __esModule: true, getRelatedObject: jest.fn() }));

describe('Given the DatasetCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        const searchResults = [
            {
                activeFlag: 'review',
                type: 'course',
            },
        ];

        test('Then no related results will be rendered', () => {
            render(<DatasetCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(screen.queryByTestId('related-dataset-object')).toBeFalsy();
        });
    });

    describe('When results can be viewed', () => {
        const searchResults = [
            {
                type: 'dataset',
                activeflag: 'active',
                datasetfields: {
                    phenotypes: [],
                    publisher: 'publisher',
                },
                tags: { features: [] },
            },
        ];

        const relatedDatasetObject = {
            id: 'id',
            datasetid: 'datasetid',
            pid: 'pid',
            type: 'dataset',
            name: 'name',
            datasetfields: {
                phenotypes: [],
                publisher: 'publisher',
            },
        };

        beforeAll(() => {
            service.getRelatedObject.mockReturnValue([relatedDatasetObject]);
        });

        test.skip('Then related results will be rendered', async () => {
            render(<DatasetCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(await screen.findByTestId('related-dataset-object')).toBeTruthy();
        });
    });
});
