import * as React from 'react';
import { testUtils } from '../../../../../test';
import '@testing-library/jest-dom/extend-expect';
import AccountDatasetsTabs from './AccountDatasetsTabs';
import { STATUS_ARCHIVE, STATUS_INREVIEW } from '../../../../configs/constants';

const props = {
    counts: { inReview: 1, active: 2, rejected: 3, archive: 4, 'active,draft': 5 },
    userType: 'admin',
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
    describe('When it is rendered and userType is admin', () => {
        beforeAll(() => {
            wrapper = testUtils.render(<AccountDatasetsTabs {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Only Pending approval tab should be rendered', () => {
            expect(wrapper.queryByText('Pending approval (1)')).toBeTruthy();
            expect(wrapper.queryByText('Active (5)')).toBeNull();
        });
    });

    describe('when userType is not admin', () => {
        beforeAll(() => {
            wrapper.rerender(<AccountDatasetsTabs {...props} userType='user' />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Active tab should be rendered', async () => {
            expect(testUtils.screen.queryByText('Active (5)')).toBeTruthy();
        });

        it('Rejected tab should be rendered', async () => {
            expect(testUtils.screen.queryByText('Rejected (3)')).toBeTruthy();
        });

        it('Pending approval tab should be rendered', async () => {
            expect(testUtils.screen.queryByText('Pending approval (1)')).toBeTruthy();
        });

        it('Archived tab should be rendered', async () => {
            expect(testUtils.screen.queryByText('Archived (4)')).toBeTruthy();
        });

        it('onSelect Tab', async () => {
            testUtils.fireEvent.click(testUtils.screen.queryByText('Archived (4)'));
            expect(props.onSelectTab.mock.calls.length).toBe(1);
            expect(props.onSelectTab.mock.calls[0][0]).toBe(STATUS_ARCHIVE);
        });
    });
});
