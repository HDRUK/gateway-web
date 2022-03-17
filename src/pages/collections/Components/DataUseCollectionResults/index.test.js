import React from 'react';
import { render, screen } from '@testing-library/react';
import DataUseCollectionResults from './index';
import { getRelatedObjectRequest } from '../../../../services/related-object';

jest.mock('../../../../services/related-object', () => ({ __esModule: true, getRelatedObjectRequest: jest.fn() }));

describe('Given the ProjectCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        const searchResults = [
            {
                activeFlag: 'review',
                type: 'course',
            },
        ];

        test('Then no related results will be rendered', () => {
            render(<DataUseCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(screen.queryByTestId('related-project-object')).toBeFalsy();
        });
    });

    describe('When results can be viewed', () => {
        const searchResults = [
            {
                type: 'project',
                activeflag: 'active',
                categories: {},
                tags: { features: [] },
            },
        ];

        const relatedProjectObject = {
            id: 'id',
            name: 'name',
        };

        beforeAll(() => {
            getRelatedObjectRequest.mockReturnValue([relatedProjectObject]);
        });

        test('Then related results will be rendered', async () => {
            render(<DataUseCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(await screen.findByTestId('related-project-object')).toBeTruthy();
        });
    });
});
