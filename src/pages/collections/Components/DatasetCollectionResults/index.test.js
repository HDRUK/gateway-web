import React from 'react';
import { render, screen } from '@testing-library/react';
import DatasetCollectionResults from './index';
import { getRelatedObjectRequest } from '../../../../services/related-object';

jest.mock('../../../../services/related-object', () => ({ __esModule: true, getRelatedObjectRequest: jest.fn() }));

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
            getRelatedObjectRequest.mockReturnValue([relatedDatasetObject]);
        });

        test('Then related results will be rendered', async () => {
            render(<DatasetCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(await screen.findByTestId('related-dataset-object')).toBeTruthy();
        });
    });
});
