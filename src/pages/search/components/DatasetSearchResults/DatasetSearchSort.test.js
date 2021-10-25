import { render } from '@testing-library/react';
import React from 'react';
import DatasetSearchSort from './DatasetSearchSort';

const mockSortDropdown = jest.fn();
const mockOnSort = jest.fn();

jest.mock('../SortDropdown', () => props => {
	mockSortDropdown(props);
	return <div />;
});

let wrapper;

const props = {
	search: 'search term',
	sort: 'sort by',
	onSort: mockOnSort,
};

const dropdownItems = ['relevance', 'popularity', 'metadata', 'latest', 'resources'];

describe('Given the DatasetSearchSort component', () => {
	afterEach(() => {
		mockSortDropdown.mockReset();
	});

	describe('When it is rendered', () => {
		beforeAll(() => {
			wrapper = render(<DatasetSearchSort {...props} />);
		});

		it('Then has the correct properties', () => {
			expect(mockSortDropdown).toHaveBeenCalledWith({
				dropdownItems,
				sort: 'sort by',
				handleSort: mockOnSort,
			});
		});
	});

	describe('When it is rendered with no search or sort term', () => {
		beforeAll(() => {
			wrapper = render(<DatasetSearchSort {...props} search='' sort='' />);
		});

		it('Then has the correct properties', () => {
			expect(mockSortDropdown).toHaveBeenCalledWith({
				dropdownItems,
				sort: 'metadata',
				handleSort: mockOnSort,
			});
		});
	});

	describe('When it is rendered with no sort', () => {
		beforeAll(() => {
			wrapper = render(<DatasetSearchSort {...props} sort='' />);
		});

		it('Then has the correct properties', () => {
			expect(mockSortDropdown).toHaveBeenCalledWith({
				dropdownItems,
				sort: 'relevance',
				handleSort: mockOnSort,
			});
		});
	});
});
