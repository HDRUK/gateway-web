import { render, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
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
        let wrapper;

        beforeAll(() => {
            server.listen();
            containerDiv = createPortalContainer();
            wrapper = render(<AccountDatasetRejectModal {...props} container={containerDiv} />, {
                wrapper: Providers,
            });
        });

        afterEach(() => {
            server.resetHandlers();
        });

        afterAll(() => {
            server.close();
            removePortalContainer(containerDiv);
        });

        it('Should match the snapshot', async () => {
            expect(containerDiv).toMatchSnapshot();
        });

        it('Then the Reject and go to next button should not be disabled', async () => {
            await waitFor(() => expect(wrapper.getByText('Reject and go to next')).toBeTruthy());

            const { getByText } = wrapper;
            const rejectAndGoToNextButton = getByText('Reject and go to next');
            expect(rejectAndGoToNextButton).not.toHaveAttribute('disabled');
        });

        describe('And showGoToNext is false', () => {
            beforeAll(() => {
                const { rerender } = wrapper;
                const newProps = {
                    ...props,
                    showGoToNext: false,
                };

                rerender(<AccountDatasetRejectModal {...newProps} container={containerDiv} />, {
                    wrapper: Providers,
                });
            });
            it('Then the Reject and go to next button should be disabled', async () => {
                await waitFor(() => expect(wrapper.getByText('Reject and go to next')).toBeTruthy());

                const { getByText } = wrapper;
                const rejectAndGoToNextButton = getByText('Reject and go to next');
                expect(rejectAndGoToNextButton).toHaveAttribute('disabled');
            });
        });

        describe('And the Reject button is clicked', () => {
            let button;

            beforeAll(async () => {
                const { rerender } = wrapper;

                rerender(<AccountDatasetRejectModal {...props} container={containerDiv} />, {
                    wrapper: Providers,
                });

                await waitFor(() => expect(wrapper.getByText('Reject and go to next')).toBeTruthy());

                const { getByTestId, getByLabelText } = wrapper;

                const descriptionInput = getByLabelText('Description', { exact: false });
                await fireEvent.change(descriptionInput, { target: { value: 'rejected' } });

                button = within(getByTestId('button-container')).getAllByText('Reject')[0];

                userEvent.click(button);
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
            let button;

            beforeAll(async () => {
                const { rerender } = wrapper;

                rerender(<AccountDatasetRejectModal {...props} container={containerDiv} />, {
                    wrapper: Providers,
                });

                await waitFor(() => expect(wrapper.getByText('Reject and go to next')).toBeTruthy());

                const { getByText, getByLabelText } = wrapper;

                const descriptionInput = getByLabelText('Description', { exact: false });
                fireEvent.change(descriptionInput, { target: { value: 'rejected' } });

                button = getByText('Reject and go to next');
                fireEvent.click(button);
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
