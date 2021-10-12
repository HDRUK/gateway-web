import React from 'react';
import { render, screen } from '@testing-library/react';
import ToolCollectionResults from './index';
import { getRelatedObjectRequest } from '../../../../services/related-object';

jest.mock('../../../../services/related-object');

describe('Given the ToolCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        
        const searchResults = [
            { 
                activeFlag: 'review',
                type: 'course'
            }
        ];

        test('Then no related results will be rendered', () => {
            render(<ToolCollectionResults searchResults={searchResults} />);
            expect(screen.queryByTestId('related-tool-object')).toBeFalsy();
        });
    });

    describe('When results can be viewed', () => {
        const searchResults = [
            { 
                type: 'tool',
                activeflag: 'active'
            }
        ];

        const relatedToolObject = {
            id: 'id',
            name: 'name'
        };

        beforeAll(() => {
            getRelatedObjectRequest.mockReturnValue([relatedToolObject]);
        });

        test('Then related results will be rendered', () => {
            render(<ToolCollectionResults searchResults={searchResults} />);
            expect(screen.queryByTestId('related-tool-object')).toBeTruthy();
        });
    });
});
