import { render, screen } from '@testing-library/react';
import CourseCollectionResults from './index';
import * as service from '../../../../services/related-objects';

jest.mock('../../../../services/related-objects', () => ({ __esModule: true, getRelatedObjectForCourse: jest.fn() }));

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
            service.getRelatedObjectForCourse.mockResolvedValue([relatedCourseObject]);
        });

        test.skip('Then related results will be rendered', async () => {
            render(<CourseCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(await screen.findByTestId('related-course-object')).toBeTruthy();
        });
    });
});
