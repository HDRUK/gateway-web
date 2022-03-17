import React from 'react';
import { render, screen } from '@testing-library/react';
import CourseCollectionResults from './index';
import { getRelatedObjectForCourseRequest } from '../../../../services/related-object';

jest.mock('../../../../services/related-object', () => ({ __esModule: true, getRelatedObjectForCourseRequest: jest.fn() }));

describe('Given the CourseCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        const searchResults = [
            {
                activeFlag: 'review',
                type: 'dataset',
            },
        ];

        test('Then no related results will be rendered', () => {
            render(<CourseCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(screen.queryByTestId('related-course-object')).toBeFalsy();
        });
    });

    describe('When results can be viewed', () => {
        const searchResults = [
            {
                type: 'course',
                activeflag: 'active',
                courseOptions: [],
            },
        ];

        const relatedCourseObject = {
            id: 'id',
            type: 'course',
            title: 'title',
            provider: 'provider',
            courseOptions: [],
        };

        beforeAll(() => {
            getRelatedObjectForCourseRequest.mockResolvedValue([relatedCourseObject]);
        });

        test('Then related results will be rendered', async () => {
            render(<CourseCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(await screen.findByTestId('related-course-object')).toBeTruthy();
        });
    });
});
