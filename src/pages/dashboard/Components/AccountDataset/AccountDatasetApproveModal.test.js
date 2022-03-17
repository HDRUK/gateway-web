import { render, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import AccountDatasetApproveModal from './AccountDatasetApproveModal';
import datasetOnboardingService from '../../../../services/dataset-onboarding/dataset-onboarding';
import { server } from '../../../../services/mockServer';

jest.mock('../../../../services/dataset-onboarding/dataset-onboarding');

let containerDiv;
const goToNext = jest.fn();
const closed = jest.fn();
const handleApprove = jest.fn();

describe('Given the AccountDatasetApproveModal component', () => {
    const props = {
        id: 'id',
        open: true,
        closed,
        goToNext,
        showGoToNext: true,
        handleApprove,
    };

    describe('When it is rendered', () => {
        let wrapper;

        beforeAll(() => {
            server.listen();
            containerDiv = createPortalContainer();
            wrapper = render(<AccountDatasetApproveModal {...props} container={containerDiv} />, {
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

        it('Then the Approve and go to next button should not be disabled', async () => {
            await waitFor(() => expect(wrapper.getByText('Approve and go to next')).toBeTruthy());

            const { getByText } = wrapper;
            const approveAndGoToNextButton = getByText('Approve and go to next');
            expect(approveAndGoToNextButton).not.toHaveAttribute('disabled');
        });

        describe('And showGoToNext is false', () => {
            beforeAll(() => {
                const { rerender } = wrapper;
                const newProps = {
                    ...props,
                    showGoToNext: false,
                };

                rerender(<AccountDatasetApproveModal {...newProps} container={containerDiv} />, {
                    wrapper: Providers,
                });
            });
            it('Then the Approve and go to next button should be disabled', async () => {
                await waitFor(() => expect(wrapper.getByText('Approve and go to next')).toBeTruthy());

                const { getByText } = wrapper;
                const approveAndGoToNextButton = getByText('Approve and go to next');
                expect(approveAndGoToNextButton).toHaveAttribute('disabled');
            });
        });

        describe('And the Approve button is clicked', () => {
            let button;

            beforeAll(async () => {
                const { rerender } = wrapper;

                rerender(<AccountDatasetApproveModal {...props} container={containerDiv} />, {
                    wrapper: Providers,
                });

                await waitFor(() => expect(wrapper.getByText('Approve and go to next')).toBeTruthy());

                const { getByTestId } = wrapper;
                button = within(getByTestId('button-container')).getAllByText('Approve')[0];
                fireEvent.click(button);
            });

            it('Then submits the dataset approval request', async () => {
                await waitFor(() =>
                    expect(datasetOnboardingService.putDatasetOnboarding).toHaveBeenCalledWith('id', {
                        id: 'id',
                        applicationStatus: 'approved',
                        applicationStatusDesc: '',
                    })
                );
            });

            it('Then calls the handleApprove prop to close the modal', async () => {
                await waitFor(() => expect(handleApprove).toHaveBeenCalled());
            });
        });

        describe('And the Approve and go to next button is clicked', () => {
            let button;

            beforeAll(async () => {
                const { rerender } = wrapper;

                rerender(<AccountDatasetApproveModal {...props} container={containerDiv} />, {
                    wrapper: Providers,
                });

                await waitFor(() => expect(wrapper.getByText('Approve and go to next')).toBeTruthy());

                const { getByText } = wrapper;
                button = getByText('Approve and go to next');
                fireEvent.click(button);
            });

            it('Then submits the dataset approval request', async () => {
                await waitFor(() =>
                    expect(datasetOnboardingService.putDatasetOnboarding).toHaveBeenCalledWith('id', {
                        id: 'id',
                        applicationStatus: 'approved',
                        applicationStatusDesc: '',
                    })
                );
            });

            it('Then goes to next dataset', async () => {
                await waitFor(() => expect(goToNext).toHaveBeenCalled());
            });
        });
    });
});
