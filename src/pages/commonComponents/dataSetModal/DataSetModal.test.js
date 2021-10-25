import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { getNon5SafesModalContentRequest } from '../../../services/content';
import DataSetModal from './DataSetModal';

jest.mock('../../../services/content', () => ({ 
    __esModule: true,
    default: () => jest.fn().mockImplementation(() => {}),
    getNon5SafesModalContentRequest: jest.fn().mockImplementation(() => {})
}) );

const userState = {
    loggedIn: true,
    role: "Creator",
    id: 8355047451167574,
    name: "Simon Kenyon",
    teams: "[]",
    email: "simon.kenyon@hdruk.ac.uk",
    profileComplete: true,
    provider: "google",
    advancedSearchRoles: [],
    terms: true
};

const context = {
    requiresModal: true,
    allowNewMessage: true,
    allowsMessaging: true,
    dataRequestModalContent: {body: "Data body", header: "Data header"},
    datasets: [{}],
    contactPoint: "sail@email.com",
    title: "ALLIANCE > SAIL",
    showActionButtons: true
};

const defaultProps = {
    closed: () => {},
	context: {
        datasets: []
    },
	userState: {},
	open: true,
};

let component;

describe('Given the DataSetModal component', () => {
    describe('When is5Safes is false', () => {

        beforeAll(() => {
            getNon5SafesModalContentRequest.mockResolvedValue({ data: "<div>non 5safes content</div>" });
            component = render(<DataSetModal {...defaultProps} />);
        });

        afterAll(() => {
            cleanup();
        })

        it('Should just render the non5Safes modal content', async () => {
            const { queryByText } = component;
            expect(await queryByText('non 5safes content')).toBeTruthy();
        });

        it('Should not render the Start application button', async () => {
            const { queryByText } = component;
            expect(await queryByText('Start application')).toBeFalsy();
        });
    });

    describe('When is5Safes is true', () => {
        beforeAll(() => {
            getNon5SafesModalContentRequest.mockResolvedValue({ data: "<div>non 5safes content</div>" });

            const datasetProps = {
                open: true,
                context: context,
                closed: () => {},
                userState: userState,
                is5Safes: true
            }
            
            component = render(<DataSetModal {...datasetProps} />);
        });

        afterAll(() => {
            cleanup();
        });

        it('Should not render the non5Safes modal content', async () => {
            const { queryByText } = component;
            expect(await queryByText('non 5safes content')).toBeFalsy();
        });

        it('should render the content from the dataset', async () => {
            const { queryByText } = component;
            expect(await queryByText('Data header')).toBeTruthy();
            expect(await queryByText('Data body')).toBeTruthy();
        });

        it('should render the Start Application button', async () => {
            const { queryByText } = component;
            expect(await queryByText('Start application')).toBeTruthy();
        });
    });

    describe('When showActionButtons is false', () => {
        beforeEach(() => {
            const datasetProps = {
                open: true,
                context: {...context, showActionButtons: false},
                closed: () => {},
                userState: userState,
                is5Safes: true
            }
            
            component = render(<DataSetModal {...datasetProps} />);
        });

        afterEach(() => {
            cleanup();
        });

        it('Should not render the action buttons container', async () => {
            const { queryByTestId } = component;
            expect(await queryByTestId('actionButtons')).toBeFalsy();
        });
    });
});