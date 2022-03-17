import { render } from '@testing-library/react';
import React from 'react';
import DatasetSearchResults from '.';
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
    type: 'datasets',
    search: 'search term',
    updateOnFilterBadge: jest.fn(),
    onPagination: jest.fn(),
    maxResults: 40,
    isLoading: false,
    sort: 'Sort goes here...',
};

describe('Given the DatasetSearchResults component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<DatasetSearchResults {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct number of results', () => {
            expect(mockRelatedObject).toHaveBeenCalledTimes(40);
        });

        it('Then passes the correct props', () => {
            expect(mockRelatedObject.mock.calls[0][0]).toEqual({
                data: data[0],
                activeLink: true,
                datasetLogo: '',
                datasetPublisher: 'BREATHE',
                onSearchPage: true,
                updateOnFilterBadge: props.updateOnFilterBadge,
            });
        });
    });
});
