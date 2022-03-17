import { render } from '@testing-library/react';
import React from 'react';
import CoursesSearchResults from '.';
import { data } from './mockData';

const mockRelatedObject = jest.fn();

jest.mock('../../../commonComponents/relatedObject/RelatedObject', () => props => {
    mockRelatedObject(props);
    return <div />;
});

let wrapper;

const props = {
    data,
    count: 656,
    pageNumber: 3,
    totalPages: 10,
    type: 'courses',
    search: 'search term',
    updateOnFilterBadge: jest.fn(),
    onPagination: jest.fn(),
    maxResults: 40,
    isLoading: false,
    sort: 'Sort goes here...',
};

describe('Given the CoursesSearchResults component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<CoursesSearchResults {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then calls onClick with step', () => {
            expect(wrapper.getAllByText('Flexible')).toHaveLength(1);
        });

        it('Then has the correct number of results', () => {
            expect(mockRelatedObject).toHaveBeenCalledTimes(40);
        });

        it('Then passes the correct props', () => {
            expect(mockRelatedObject.mock.calls[0][0]).toEqual({
                data: data[0],
                activeLink: true,
                onSearchPage: true,
                updateOnFilterBadge: props.updateOnFilterBadge,
            });
        });

        describe('And does not have flexible dates', () => {
            beforeAll(() => {
                props.data[0].courseOptions.flexibleDates = null;
                props.data[0].courseOptions.startDate = '2021-10-18';

                wrapper.rerender(<CoursesSearchResults {...props} />);
            });

            it('Then calls onClick with step', () => {
                expect(wrapper.getAllByText('October')).toHaveLength(1);
            });
        });
    });
});
