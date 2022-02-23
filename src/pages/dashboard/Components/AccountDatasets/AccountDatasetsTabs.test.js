import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AccountDatasetsTabs from './AccountDatasetsTabs';
import { STATUS_ARCHIVE } from '../../../../configs/constants';

const props = {
	counts: { inReview: 1, active: 2, rejected: 3, archive: 4, ['active,draft']: 5 },
	team: 'admin',
	onSelectTab: jest.fn(),
	activeKey: STATUS_INREVIEW,
};

jest.mock('react', () => {
	const React = jest.requireActual('react');
	React.Suspense = ({ children }) => children;
	return React;
});

let wrapper;

describe('Given the AccountDatasetsTabs component', () => {
	describe('When it is rendered and team is admin', () => {
		beforeAll(() => {
			wrapper = render(<AccountDatasetsTabs {...props} />, {
				wrapper: Providers,
			});
		});

		it('Then matches the previous snapshot', () => {
			expect(wrapper.container).toMatchSnapshot();
		});

		it('Only Pending approval tab should be rendered', () => {
			expect(wrapper.queryByText('Pending approval (1)')).toBeTruthy();
			expect(wrapper.queryByText('Active (5)')).toBeNull();
		});
	});

	describe('when team is not admin', () => {
		beforeAll(() => {
			wrapper.rerender(<AccountDatasetsTabs {...props} team='manager' />, {
				wrapper: Providers,
			});
		});

		it('Then matches the previous snapshot', () => {
			expect(wrapper.container).toMatchSnapshot();
		});

		it('Active tab should be rendered', async () => {
			expect(screen.queryByText('Active (5)')).toBeTruthy();
		});

		it('Rejected tab should be rendered', async () => {
			expect(screen.queryByText('Rejected (3)')).toBeTruthy();
		});

		it('Pending approval tab should be rendered', async () => {
			expect(screen.queryByText('Pending approval (1)')).toBeTruthy();
		});

		it('Archived tab should be rendered', async () => {
			expect(screen.queryByText('Archived (4)')).toBeTruthy();
		});

		it('onSelect Tab', async () => {
			fireEvent.click(screen.queryByText('Archived (4)'));
			expect(props.onSelectTab.mock.calls.length).toBe(1);
			expect(props.onSelectTab.mock.calls[0][0]).toBe(STATUS_ARCHIVE);
		});
	});
});
