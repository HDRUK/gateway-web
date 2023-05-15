import * as React from 'react';
import { testUtils } from '../../../../../test';
import '@testing-library/jest-dom/extend-expect';
import AccountDatasetsTabs from './AccountDatasetsTabs';
import { STATUS_ARCHIVE, STATUS_INREVIEW } from '../../../../configs/constants';

const props = {
    counts: { inReview: 1, active: 2, rejected: 3, archive: 4, 'active,draft': 5 },
    teamType: 'admin',
    onSelectTab: jest.fn(),
    activeKey: STATUS_INREVIEW,
};

jest.mock('react', () => {
    const React = jest.requireActual('react');
    React.Suspense = ({ children }) => children;
    return React;
});

describe('Given the AccountDatasetsTabs component', () => {
    describe('When it is rendered and teamType is admin', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = testUtils.render(<AccountDatasetsTabs {...props} />);
        });

        afterAll(() => {
            testUtils.cleanup();
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Only Pending approval tab should be rendered', () => {
            expect(wrapper.queryByText('Pending approval (1)')).toBeTruthy();
            expect(wrapper.queryByText('Active (5)')).toBeNull();
        });
    });

    describe('when teamType is not admin', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = testUtils.render(<AccountDatasetsTabs {...props} teamType='user' />);
        });

        afterAll(() => {
            testUtils.cleanup();
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Active tab should be rendered', async () => {
            expect(testUtils.screen.queryByText('Active (2)')).toBeTruthy();
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
