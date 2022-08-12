import React from 'react';
import { render, screen } from '@testing-library/react';
import PersonCollectionResults from './index';
import service from '../../../../services/related-objects';

jest.mock('../../../../services/related-objects', () => ({ __esModule: true, getRelatedObject: jest.fn() }));

describe('Given the PersonCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        const searchResults = [
            {
                activeFlag: 'review',
                type: 'course',
            },
        ];

        test('Then no related results will be rendered', () => {
            render(<PersonCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(screen.queryByTestId('related-person-object')).toBeFalsy();
        });
    });

    describe('When results can be viewed', () => {
        const searchResults = [
            {
                type: 'person',
                activeflag: 'active',
            },
        ];

        const relatedPersonObject = {
            id: 'id',
            name: 'name',
            firstname: 'firstname',
            lastname: 'lastname',
        };

        beforeAll(() => {
            service.getRelatedObject.mockReturnValue([relatedPersonObject]);
        });

        test('Then related results will be rendered', () => {
            render(<PersonCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(screen.queryByTestId('related-person-object')).toBeTruthy();
        });
    });
});
