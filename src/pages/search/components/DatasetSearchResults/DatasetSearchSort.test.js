import { render } from '@testing-library/react';
import React from 'react';
import DatasetSearchSort from './DatasetSearchSort';

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

const options = ['relevance', 'popularity', 'metadata', 'latest', 'resources'];

describe('Given the DatasetSearchSort component', () => {
    afterEach(() => {
        mockSortDropdown.mockReset();
    });

    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<DatasetSearchSort {...props} />);
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
            wrapper = render(<DatasetSearchSort {...props} search='' sort='' />);
        });

        it('Then has the correct properties', () => {
            expect(mockSortDropdown.mock.calls[0][0]).toMatchObject({
                value: '',
                defaultValue: 'metadata',
                options,
            });
        });
    });

    describe('When it is rendered with no sort', () => {
        beforeAll(() => {
            wrapper = render(<DatasetSearchSort {...props} sort='' />);
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
