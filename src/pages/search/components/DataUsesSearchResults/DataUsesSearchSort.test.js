import React from 'react';
import DataUsesSearchSort from './DataUsesSearchSort';
import { render } from '@testing-library/react';

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

const dropdownItems = ['relevance', 'popularity', 'latest', 'resources'];

describe('Given the DataUsesSearchSort component', () => {
	afterEach(() => {
		mockSortDropdown.mockReset();
	});

	describe('When it is rendered', () => {
		beforeAll(() => {
			wrapper = render(<DataUsesSearchSort {...props} />);
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
			wrapper = render(<DataUsesSearchSort {...props} search='' sort='' />);
		});

		it('Then has the correct properties', () => {
			expect(mockSortDropdown).toHaveBeenCalledWith({
				dropdownItems,
				sort: 'latest',
				handleSort: mockOnSort,
			});
		});
	});

	describe('When it is rendered with no sort', () => {
		beforeAll(() => {
			wrapper = render(<DataUsesSearchSort {...props} sort='' />);
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
