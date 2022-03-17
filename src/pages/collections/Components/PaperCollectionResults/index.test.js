import React from 'react';
import { render, screen } from '@testing-library/react';
import PaperCollectionResults from './index';
import { getRelatedObjectRequest } from '../../../../services/related-object';

jest.mock('../../../../services/related-object', () => ({ __esModule: true, getRelatedObjectRequest: jest.fn() }));

describe('Given the PaperCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        const searchResults = [
            {
                activeFlag: 'review',
                type: 'course',
            },
        ];

        test('Then no related results will be rendered', () => {
            render(<PaperCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(screen.queryByTestId('related-paper-object')).toBeFalsy();
        });
    });

    describe('When results can be viewed', () => {
        const searchResults = [
            {
                type: 'paper',
                activeflag: 'active',
                tags: { features: [] },
            },
        ];

        const relatedPaperObject = {
            id: 'id',
            authorsNew: 'authorsNew',
            type: 'paper',
            name: 'name',
            journal: 'journal',
            journalYear: 'journalYear',
        };

        beforeAll(() => {
            getRelatedObjectRequest.mockReturnValue([relatedPaperObject]);
        });

        test('Then related results will be rendered', async () => {
            render(<PaperCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(await screen.findByTestId('related-paper-object')).toBeTruthy();
        });
    });
});
