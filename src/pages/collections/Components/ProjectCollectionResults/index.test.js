import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectCollectionResults from './index';
import { getRelatedObjectRequest } from '../../../../services/related-object';

jest.mock('../../../../services/related-object');

describe('Given the ProjectCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        
        const searchResults = [
            { 
                activeFlag: 'review',
                type: 'course'
            }
        ];

        test('Then no related results will be rendered', () => {
            render(<ProjectCollectionResults searchResults={searchResults} />);
            expect(screen.queryByTestId('related-project-object')).toBeFalsy();
        });
    });

    describe('When results can be viewed', () => {
        const searchResults = [
            { 
                type: 'project',
                activeflag: 'active'
            }
        ];

        const relatedProjectObject = {
            id: 'id',
            name: 'name'
        };

        beforeAll(() => {
            getRelatedObjectRequest.mockReturnValue([relatedProjectObject]);
        });

        test('Then related results will be rendered', () => {
            render(<ProjectCollectionResults searchResults={searchResults} />);
            expect(screen.queryByTestId('related-project-object')).toBeTruthy();
        });
    });
});
