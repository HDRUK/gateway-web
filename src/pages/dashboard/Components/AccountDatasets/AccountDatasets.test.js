import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import AccountDatasets from './AccountDatasets';
import { server } from '../../../../services/mockServer';
import { mockGetPublisher } from '../../../../services/dataset-onboarding/mockMsw';
import '../../../../utils/test.util';
import { DATASETS_STATUS_ACTIVE, STATUS_INREVIEW } from '../../../../configs/constants';

const mockAccountDatasetsTabs = jest.fn();
const mockAccountDatasetsContent = jest.fn();

jest.mock('./AccountDatasetsTabs', () => props => {
    mockAccountDatasetsTabs(props);

    return (
        <button
            onClick={() => {
                props.onSelectTab(STATUS_INREVIEW);
            }}
        >
            Select tab
        </button>
    );
});

jest.mock('./AccountDatasetsContent', () => props => {
    mockAccountDatasetsContent(props);

    return (
        <button
            onClick={() => {
                props.onSubmit({
                    search: 'dataset',
                    sortBy: 'metadataQuality',
                    sortDirection: 'desc',
                });
            }}
        >
            Submit
        </button>
    );
});

jest.mock('../../../../components/Icon', () => 'Icon');

const props = {
    alert: { message: 'Message goes here' },
    team: 'applicant',
};

let wrapper;

describe('Given the AccountDatasets component', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    describe('When it is rendered', () => {
        beforeAll(async () => {
            wrapper = render(<AccountDatasets {...props} />, {
                wrapper: Providers,
            });

            await waitFor(() => expect(wrapper.getByText('Select tab')).toBeTruthy());
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then shows a success message', () => {
            expect(wrapper.getByText('Message goes here')).toBeTruthy();
        });

        it('Then calls the tabs with the correct props', async () => {
            await waitFor(() => {
                expect(mockAccountDatasetsTabs).toHaveBeenCalledLastWithMatch({
                    activeKey: DATASETS_STATUS_ACTIVE,
                    counts: { inReview: 19 },
                    team: 'applicant',
                });
            });
        });

        it('Then calls the results with the correct props', async () => {
            await waitFor(() => {
                return expect(mockAccountDatasetsContent).toHaveBeenCalledLastWithMatch({
                    data: mockGetPublisher.data.results.listOfDatasets,
                    isFetched: true,
                    isLoading: false,
                    status: DATASETS_STATUS_ACTIVE,
                    team: 'applicant',
                });
            });
        });

        describe('And submit is clicked', () => {
            beforeAll(() => {
                mockAccountDatasetsContent.mockClear();

                act(async () => {
                    const submit = wrapper.getByText('Submit');

                    await fireEvent.click(submit, {
                        search: 'dataset',
                        sortBy: 'metadataQuality',
                        sortDirection: 'desc',
                    });
                });
            });

            it('Then calls the results with the correct props', async () => {
                await waitFor(() => {
                    return expect(mockAccountDatasetsContent).toHaveBeenCalledLastWithMatch({
                        isFetched: true,
                        isLoading: false,
                        status: DATASETS_STATUS_ACTIVE,
                        team: 'applicant',
                    });
                });
            });

            describe('And the tab is clicked', () => {
                beforeAll(() => {
                    mockAccountDatasetsContent.mockClear();

                    act(async () => {
                        const tab = wrapper.getByText('Select tab', STATUS_INREVIEW);

                        await fireEvent.click(tab);
                    });
                });

                it('Then calls the results with the correct props', async () => {
                    await waitFor(() => {
                        return expect(mockAccountDatasetsContent).toHaveBeenCalledLastWithMatch({
                            data: mockGetPublisher.data.results.listOfDatasets,
                            isFetched: true,
                            isLoading: false,
                            status: STATUS_INREVIEW,
                            team: 'applicant',
                        });
                    });
                });
            });
        });
    });
});
