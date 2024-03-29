import '@testing-library/jest-dom/extend-expect';

import { datasetOnboardingService } from 'services';
import { testUtils } from '../../../../../test';
import AccountDatasetApproveModal from './AccountDatasetApproveModal';
import { server } from '../../../../services/mockServer';

jest.mock('services');

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
            containerDiv = testUtils.createPortalContainer();
            wrapper = testUtils.render(<AccountDatasetApproveModal {...props} container={containerDiv} />);
        });

        afterEach(() => {
            server.resetHandlers();
        });

        afterAll(() => {
            server.close();
            testUtils.removePortalContainer(containerDiv);
        });

        it('Should match the snapshot', async () => {
            expect(containerDiv).toMatchSnapshot();
        });

        it('Then the Approve and go to next button should not be disabled', async () => {
            await testUtils.waitFor(() => expect(wrapper.getByText('Approve and go to next')).toBeTruthy());

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

                rerender(<AccountDatasetApproveModal {...newProps} container={containerDiv} />);
            });
            it('Then the Approve and go to next button should be disabled', async () => {
                await testUtils.waitFor(() => expect(wrapper.getByText('Approve and go to next')).toBeTruthy());

                const { getByText } = wrapper;
                const approveAndGoToNextButton = getByText('Approve and go to next');
                expect(approveAndGoToNextButton).toHaveAttribute('disabled');
            });
        });

        describe('And the Approve button is clicked', () => {
            beforeAll(async () => {
                const { rerender } = wrapper;

                rerender(<AccountDatasetApproveModal {...props} container={containerDiv} />);

                await testUtils.waitFor(() => expect(wrapper.getByText('Approve and go to next')).toBeTruthy());

                const { getByTestId } = wrapper;
                const button = testUtils.within(getByTestId('button-container')).getAllByText('Approve')[0];
                testUtils.fireEvent.click(button);
            });

            it('Then submits the dataset approval request', async () => {
                await testUtils.waitFor(() =>
                    expect(datasetOnboardingService.putDatasetOnboarding).toHaveBeenCalledWith('id', {
                        id: 'id',
                        applicationStatus: 'approved',
                        applicationStatusDesc: '',
                    })
                );
            });

            it('Then calls the handleApprove prop to close the modal', async () => {
                await testUtils.waitFor(() => expect(handleApprove).toHaveBeenCalled());
            });
        });

        describe('And the Approve and go to next button is clicked', () => {
            let button;

            beforeAll(async () => {
                const { rerender } = wrapper;

                rerender(<AccountDatasetApproveModal {...props} container={containerDiv} />);

                await testUtils.waitFor(() => expect(wrapper.getByText('Approve and go to next')).toBeTruthy());

                const { getByText } = wrapper;
                button = getByText('Approve and go to next');
                testUtils.fireEvent.click(button);
            });

            it('Then submits the dataset approval request', async () => {
                await testUtils.waitFor(() =>
                    expect(datasetOnboardingService.putDatasetOnboarding).toHaveBeenCalledWith('id', {
                        id: 'id',
                        applicationStatus: 'approved',
                        applicationStatusDesc: '',
                    })
                );
            });

            it('Then goes to next dataset', async () => {
                await testUtils.waitFor(() => expect(goToNext).toHaveBeenCalled());
            });
        });
    });
});
