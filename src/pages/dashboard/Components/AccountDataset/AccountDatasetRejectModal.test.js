import { render, waitFor, cleanup, fireEvent, createPortalContainer, removePortalContainer, screen } from 'testUtils';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import AccountDatasetRejectModal from './AccountDatasetRejectModal';
import datasetOnboardingService from '../../../../services/dataset-onboarding/dataset-onboarding';
import { server } from '../../../../services/mockServer';

jest.mock('../../../../services/dataset-onboarding/dataset-onboarding');

let containerDiv;
const goToNext = jest.fn();
const closed = jest.fn();
const handleReject = jest.fn();

describe('Given the AccountDatasetRejectModal component', () => {
    const props = {
        id: 'id',
        open: true,
        closed,
        goToNext,
        handleReject,
        showGoToNext: true,
    };

    describe('When it is rendered', () => {
        beforeAll(() => {
            server.listen();
            containerDiv = createPortalContainer();
        });

        afterEach(() => {
            server.resetHandlers();
            cleanup();
        });

        afterAll(() => {
            server.close();
            removePortalContainer(containerDiv);
        });

        it('Should match the snapshot', async () => {
            expect(containerDiv).toMatchSnapshot();
        });

        it('Then the Reject and go to next button should be disabled until text is entered', async () => {
            render(<AccountDatasetRejectModal {...props} container={containerDiv} />);

            const descriptionInput = screen.getByLabelText('Description', { exact: false });
            const rejectAndGoToNextButton = screen.getByText('Reject and go to next');

            expect(rejectAndGoToNextButton).toBeDisabled();

            fireEvent.change(descriptionInput, { target: { value: 'content' } });

            expect(rejectAndGoToNextButton).not.toBeDisabled();
        });

        describe('And showGoToNext is false', () => {
            it('Then the Reject and go to next button should be disabled even when text is entered', async () => {
                render(<AccountDatasetRejectModal {...props} showGoToNext={false} container={containerDiv} />);
                const descriptionInput = screen.getByLabelText('Description', { exact: false });
                const rejectAndGoToNextButton = screen.getByText('Reject and go to next');

                expect(rejectAndGoToNextButton).toBeDisabled();

                fireEvent.change(descriptionInput, { target: { value: 'content' } });

                expect(rejectAndGoToNextButton).toBeDisabled();
            });
        });

        describe('And the Reject button is clicked', () => {
            beforeAll(async () => {
                render(<AccountDatasetRejectModal {...props} container={containerDiv} />);

                const descriptionInput = screen.getByLabelText('Description', { exact: false });
                fireEvent.change(descriptionInput, { target: { value: 'rejected' } });

                const button = screen.getByText('Reject');

                button.click();
            });

            it('Then submits the dataset rejection request', async () => {
                await waitFor(() =>
                    expect(datasetOnboardingService.putDatasetOnboarding).toHaveBeenCalledWith('id', {
                        id: 'id',
                        applicationStatus: 'rejected',
                        applicationStatusDesc: 'rejected',
                    })
                );
            });

            it('Then calls the handleReject prop to close the modal', async () => {
                await waitFor(() => expect(handleReject).toHaveBeenCalled());
            });
        });

        describe('And the Reject and go to next button is clicked', () => {
            beforeAll(async () => {
                render(<AccountDatasetRejectModal {...props} container={containerDiv} />);

                const descriptionInput = screen.getByLabelText('Description', { exact: false });
                fireEvent.change(descriptionInput, { target: { value: 'rejected' } });

                const button = screen.getByText('Reject and go to next');
                button.click();
            });

            it('Then submits the dataset rejection request', async () => {
                await waitFor(() =>
                    expect(datasetOnboardingService.putDatasetOnboarding).toHaveBeenCalledWith('id', {
                        id: 'id',
                        applicationStatus: 'rejected',
                        applicationStatusDesc: 'rejected',
                    })
                );
            });

            it('Then goes to next dataset', async () => {
                await waitFor(() => expect(goToNext).toHaveBeenCalled());
            });
        });
    });
});
