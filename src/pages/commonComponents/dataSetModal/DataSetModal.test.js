import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { testUtils } from '../../../../test';

import DataSetModal from './DataSetModal';

jest.mock('../../../services/content', () => ({
    __esModule: true,
    getNon5SafesModalContentRequest: jest.fn().mockReturnValue({ data: '<div>non 5safes content</div>' }),
}));

const userState = {
    loggedIn: true,
    role: 'Creator',
    id: 8355047451167574,
    name: 'Simon Kenyon',
    teams: '[]',
    email: 'simon.kenyon@hdruk.ac.uk',
    profileComplete: true,
    provider: 'google',
    advancedSearchRoles: [],
    terms: true,
};

const context = {
    requiresModal: true,
    allowNewMessage: true,
    allowsMessaging: true,
    dataRequestModalContent: { body: 'Data body', header: 'Data header' },
    datasets: [{}],
    contactPoint: 'sail@email.com',
    title: 'ALLIANCE > SAIL',
    showActionButtons: true,
};

const defaultProps = {
    closed: () => {},
    context: {
        datasets: [],
    },
    userState: {},
    open: true,
};

describe('Given the DataSetModal component', () => {
    describe('When is5Safes is false', () => {
        beforeAll(() => {
            // getNon5SafesModalContentRequest = jest.fn().mockReturnValue({ data: '<div>non 5safes content</div>' });

            testUtils.render(<DataSetModal {...defaultProps} />);
        });

        afterAll(() => {
            testUtils.cleanup();
        });

        it('Should just render the non5Safes modal content', async () => {
            expect(testUtils.screen.getByText('non 5safes content')).toBeInTheDocument();
        });

        it('Should not render the Start application button', async () => {
            expect(testUtils.screen.queryByText('Start application')).not.toBeInTheDocument();
        });
    });

    describe('When is5Safes is true', () => {
        beforeAll(() => {
            // getNon5SafesModalContentRequest = jest.fn().mockResolvedValue({ data: '<div>non 5safes content</div>' });

            const datasetProps = {
                open: true,
                context,
                closed: () => {},
                userState,
                is5Safes: true,
            };

            testUtils.render(<DataSetModal {...datasetProps} />);
        });

        afterAll(() => {
            testUtils.cleanup();
        });

        it('Should not render the non5Safes modal content', async () => {
            expect(testUtils.screen.queryByText('non 5safes content')).not.toBeInTheDocument();
        });

        it('should render the content from the dataset', async () => {
            expect(testUtils.screen.queryByText('Data header')).toBeInTheDocument();
            expect(testUtils.screen.queryByText('Data body')).toBeInTheDocument();
        });

        it('should render the Start Application button', async () => {
            expect(testUtils.screen.queryByText('Start application')).toBeInTheDocument();
        });
    });

    describe('When showActionButtons is false', () => {
        beforeEach(() => {
            const datasetProps = {
                open: true,
                context: { ...context, showActionButtons: false },
                closed: () => {},
                userState,
                is5Safes: true,
            };

            testUtils.render(<DataSetModal {...datasetProps} />);
        });

        afterEach(() => {
            testUtils.cleanup();
        });

        it('Should not render the action buttons container', async () => {
            expect(testUtils.screen.queryByTestId('actionButtons')).not.toBeInTheDocument();
        });
    });
});
