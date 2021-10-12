import React from 'react';
import { render, screen } from '@testing-library/react';
import CourseCollectionResults from './index';
import { getRelatedObjectForCourseRequest } from '../../../../services/related-object';

jest.mock('../../../../services/related-object');

describe('Given the CourseCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        
        const searchResults = [
            { 
                activeFlag: 'review',
                type: 'dataset'
            }
        ];

        test('Then no related results will be rendered', () => {
            render(<CourseCollectionResults searchResults={searchResults} />);
            expect(screen.queryByTestId('related-course-object')).toBeFalsy();
        });
    });

    describe('When results can be viewed', () => {
        const searchResults = [
            { 
                type: 'course',
                activeflag: 'active'
            }
        ];

        const relatedCourseObject = {
            id: 'id',
            type: 'course',
            title: 'title',
            provider: 'provider'
        };

        beforeAll(() => {
            getRelatedObjectForCourseRequest.mockReturnValue([relatedCourseObject]);
        });

        test('Then related results will be rendered', () => {
            render(<CourseCollectionResults searchResults={searchResults} />);
            expect(screen.queryByTestId('related-course-object')).toBeTruthy();
        });
    });
});
