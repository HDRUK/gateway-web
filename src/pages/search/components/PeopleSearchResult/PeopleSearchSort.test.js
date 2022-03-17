import { render } from '@testing-library/react';
import React from 'react';
import PeopleSearchSort from './PeopleSearchSort';

const mockSortDropdown = jest.fn();
const mockOnSort = jest.fn();

jest.mock('../../../../components/SortDropdown', () => props => {
    mockSortDropdown(props);
    return <div />;
});

let wrapper;

const props = {
    search: 'search term',
    sort: 'sort by',
    onSort: mockOnSort,
};

const options = ['relevance', 'popularity', 'latest', 'resources'];

describe('Given the PeopleSearchSort component', () => {
    afterEach(() => {
        mockSortDropdown.mockReset();
    });

    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<PeopleSearchSort {...props} />);
        });

        it('Then has the correct properties', () => {
            expect(mockSortDropdown.mock.calls[0][0]).toMatchObject({
                value: 'sort by',
                defaultValue: 'relevance',
                options,
            });
        });
    });

    describe('When it is rendered with no search or sort term', () => {
        beforeAll(() => {
            wrapper = render(<PeopleSearchSort {...props} search='' sort='' />);
        });

        it('Then has the correct properties', () => {
            expect(mockSortDropdown.mock.calls[0][0]).toMatchObject({
                value: '',
                defaultValue: 'latest',
                options,
            });
        });
    });

    describe('When it is rendered with no sort', () => {
        beforeAll(() => {
            wrapper = render(<PeopleSearchSort {...props} sort='' />);
        });

        it('Then has the correct properties', () => {
            expect(mockSortDropdown.mock.calls[0][0]).toMatchObject({
                value: '',
                defaultValue: 'relevance',
                options,
            });
        });
    });
});
