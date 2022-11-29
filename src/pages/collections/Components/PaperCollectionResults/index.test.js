import React from 'react';
import { render, screen } from '@testing-library/react';
import PaperCollectionResults from './index';
import * as service from '../../../../services/related-objects/related-objects';

jest.mock('../../../../services/related-objects/related-objects', () => ({ __esModule: true, getRelatedObject: jest.fn() }));

describe.skip('Given the PaperCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        const searchResults = [
            {
                activeFlag: 'review',
                type: 'course',
            },
        ];

        test('Then no related results will be rendered', () => {
            render(<PaperCollectionResults userId='123' searchResults={searchResults} relatedObjects={[]} />);
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
            service.getRelatedObject.mockReturnValue([relatedPaperObject]);
        });

        test('Then related results will be rendered', async () => {
            render(<PaperCollectionResults userId='123' searchResults={searchResults} relatedObjects={[]} />);
            expect(await screen.findByTestId('related-paper-object')).toBeTruthy();
        });
    });
});
