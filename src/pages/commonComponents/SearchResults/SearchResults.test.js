import React from 'react';
import SearchResults from '.';
import { render } from '@testing-library/react';
import { data } from './mockData';

let wrapper;

const resultsProp = jest.fn();
const mockRelatedObject = jest.fn();

jest.mock('../relatedObject/RelatedObject', () => props => {
    mockRelatedObject(props);
    return <div />;
});

const props = {
    data,
    count: 656,
    pageNumber: 3,
    totalPages: 10,
    type: 'dataset',
    search: 'search term',
    updateOnFilterBadge: jest.fn(),
    onPagination: jest.fn(),
    maxResults: 40,
    isLoading: false,
    sort: 'Sort goes here...',
};

describe('Given the SearchResults component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<SearchResults {...props} isLoading={true} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then contains a loader', () => {
            expect(wrapper.getByText('Loading...')).toBeTruthy();
        });

        describe('And it is no longer loading', () => {
            beforeAll(() => {
                wrapper.rerender(<SearchResults {...props} />);
            });

            it('Then matches the previous snapshot', () => {
                expect(wrapper.container).toMatchSnapshot();
            });

            it('Then doesnt contain a loader', () => {
                expect(wrapper.queryByText('Loading...')).toBeNull();
            });

            it('Then contains a sort', () => {
                expect(wrapper.getByText('Sort goes here...')).toBeTruthy();
            });

            it('Then has the correct number of results', () => {
                expect(mockRelatedObject).toHaveBeenCalledTimes(40);
            });

            describe('And page 2 is clicked', () => {
                beforeAll(() => {
                    fireEvent.click(wrapper.getByText('2'));
                });

                it('Then calls onPagination with the correct args', () => {
                    expect(props.onPagination).toHaveBeenCalledWith('dataset', 40);
                });
            });

            describe('And there is a cutom results function', () => {
                beforeAll(() => {
                    mockRelatedObject.mockReset();

                    wrapper.rerender(<SearchResults {...props} results={resultsProp} />);
                });

                it('Then calls the function with the correct data', () => {
                    expect(resultsProp).toHaveBeenCalledWith(data);
                });
            });

            describe('And the count is zero', () => {
                beforeAll(() => {
                    wrapper.rerender(<SearchResults {...props} count={0} />);
                });

                it('Then matches the previous snapshot', () => {
                    expect(wrapper.container).toMatchSnapshot();
                });

                it('Then does not show results', () => {
                    expect(mockRelatedObject).toHaveBeenCalledTimes(0);
                });

                it('Then shows a no results message', () => {
                    expect(wrapper.getByText('We couldn’t find any dataset matching the search term ‘search term’')).toBeTruthy();
                });

                describe('And there is a custom error message', () => {
                    beforeAll(() => {
                        wrapper.rerender(
                            <SearchResults
                                {...props}
                                count={0}
                                errorMessage={({ type, search }) => `No results matching ${search} for ${type}`}
                            />
                        );
                    });

                    it('Then shows the correct message', () => {
                        expect(wrapper.getByText(`No results matching search term for dataset`)).toBeTruthy();
                    });
                });
            });

            describe('And there is only 1 page of results', () => {
                beforeAll(() => {
                    wrapper.rerender(<SearchResults {...props} count={39} />);
                });

                it('Then does not show pagination', () => {
                    expect(wrapper.queryByText('1')).toBeNull();
                });
            });
        });
    });
});
