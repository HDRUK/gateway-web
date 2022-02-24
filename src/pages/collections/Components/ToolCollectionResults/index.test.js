import React from 'react';
import { render, screen } from '@testing-library/react';
import ToolCollectionResults from './index';
import { getRelatedObjectByType } from '../../../../services/related-objects/related-objects';

jest.mock('../../../../services/related-objects/related-objects', () => ({ __esModule: true, getRelatedObjectByType: jest.fn() }));

describe('Given the ToolCollectionResults component', () => {
	describe('When no results can be viewed', () => {
		const searchResults = [
			{
				activeFlag: 'review',
				type: 'course',
			},
		];

		test('Then no related results will be rendered', () => {
			render(<ToolCollectionResults searchResults={searchResults} relatedObjects={[]} />);
			expect(screen.queryByTestId('related-tool-object')).toBeFalsy();
		});
	});

	describe('When results can be viewed', () => {
		const searchResults = [
			{
				type: 'tool',
				activeflag: 'active',
				categories: {},
				tags: { features: [] },
			},
		];

		const relatedToolObject = {
			id: 'id',
			name: 'name',
			categories: {},
			tags: { features: [] },
		};

		beforeAll(() => {
			getRelatedObjectByType.mockReturnValue([relatedToolObject]);
		});

		test('Then related results will be rendered', async () => {
			render(<ToolCollectionResults searchResults={searchResults} relatedObjects={[]} />);
			expect(await screen.findByTestId('related-tool-object')).toBeTruthy();
		});
	});
});
