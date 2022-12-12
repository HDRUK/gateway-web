import { render } from '@testing-library/react';
import React from 'react';
import ToolsSearchSort from './ToolsSearchSort';

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

describe('Given the ToolsSearchSort component', () => {
    afterEach(() => {
        mockSortDropdown.mockReset();
    });

    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<ToolsSearchSort {...props} />);
        });

        it('Then has the correct properties', () => {
            expect(mockSortDropdown.mock.calls[0][0]).toMatchObject({
                value: 'sort by',
                defaultValue: 'relevance',
                options,
            });
        });

        describe('And there is no search or sort term', () => {
            beforeAll(() => {
                wrapper = render(<ToolsSearchSort {...props} search='' sort='' />);
            });

            it('Then has the correct properties', () => {
                expect(mockSortDropdown.mock.calls[0][0]).toMatchObject({
                    value: '',
                    defaultValue: 'latest',
                    options,
                });
            });
        });

        describe('And there is no sort', () => {
            beforeAll(() => {
                wrapper = render(<ToolsSearchSort {...props} sort='' />);
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
});
