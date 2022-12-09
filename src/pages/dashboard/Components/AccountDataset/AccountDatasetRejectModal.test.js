import { datasetOnboardingService } from 'services';
import { testUtils } from '../../../../../test';
import '@testing-library/jest-dom/extend-expect';
import AccountDatasetRejectModal from './AccountDatasetRejectModal';
import { server } from '../../../../services/mockServer';

jest.mock('services');

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
            containerDiv = testUtils.createPortalContainer();
        });

        afterEach(() => {
            server.resetHandlers();
            testUtils.cleanup();
        });

        afterAll(() => {
            server.close();
            testUtils.removePortalContainer(containerDiv);
        });

        it('Should match the snapshot', async () => {
            expect(containerDiv).toMatchSnapshot();
        });

        it('Then the Reject and go to next button should be disabled until text is entered', async () => {
            testUtils.render(<AccountDatasetRejectModal {...props} container={containerDiv} />);

            const descriptionInput = testUtils.screen.getByLabelText('Description', { exact: false });
            const rejectAndGoToNextButton = testUtils.screen.getByText('Reject and go to next');

            expect(rejectAndGoToNextButton).toBeDisabled();

            testUtils.fireEvent.change(descriptionInput, { target: { value: 'content' } });

            expect(rejectAndGoToNextButton).not.toBeDisabled();
        });

        describe('And showGoToNext is false', () => {
            it('Then the Reject and go to next button should be disabled even when text is entered', async () => {
                testUtils.render(<AccountDatasetRejectModal {...props} showGoToNext={false} container={containerDiv} />);
                const descriptionInput = testUtils.screen.getByLabelText('Description', { exact: false });
                const rejectAndGoToNextButton = testUtils.screen.getByText('Reject and go to next');

                expect(rejectAndGoToNextButton).toBeDisabled();

                testUtils.fireEvent.change(descriptionInput, { target: { value: 'content' } });

                expect(rejectAndGoToNextButton).toBeDisabled();
            });
        });

        describe('And the Reject button is clicked', () => {
            beforeAll(async () => {
                testUtils.render(<AccountDatasetRejectModal {...props} container={containerDiv} />);

                const descriptionInput = testUtils.screen.getByLabelText('Description', { exact: false });
                testUtils.fireEvent.change(descriptionInput, { target: { value: 'rejected' } });

                const button = testUtils.screen.getByText('Reject');

                button.click();
            });

            it('Then submits the dataset rejection request', async () => {
                await testUtils.waitFor(() =>
                    expect(datasetOnboardingService.putDatasetOnboarding).toHaveBeenCalledWith('id', {
                        id: 'id',
                        applicationStatus: 'rejected',
                        applicationStatusDesc: 'rejected',
                    })
                );
            });

            it('Then calls the handleReject prop to close the modal', async () => {
                await testUtils.waitFor(() => expect(handleReject).toHaveBeenCalled());
            });
        });

        describe('And the Reject and go to next button is clicked', () => {
            beforeAll(async () => {
                testUtils.render(<AccountDatasetRejectModal {...props} container={containerDiv} />);

                const descriptionInput = testUtils.screen.getByLabelText('Description', { exact: false });
                testUtils.fireEvent.change(descriptionInput, { target: { value: 'rejected' } });

                const button = testUtils.screen.getByText('Reject and go to next');
                button.click();
            });

            it('Then submits the dataset rejection request', async () => {
                await testUtils.waitFor(() =>
                    expect(datasetOnboardingService.putDatasetOnboarding).toHaveBeenCalledWith('id', {
                        id: 'id',
                        applicationStatus: 'rejected',
                        applicationStatusDesc: 'rejected',
                    })
                );
            });

            it('Then goes to next dataset', async () => {
                await testUtils.waitFor(() => expect(goToNext).toHaveBeenCalled());
            });
        });
    });
});
