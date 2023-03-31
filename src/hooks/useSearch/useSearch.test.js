import { datasetOnboardingService } from 'services';
import { testUtils } from '../../../test';
import { mockGetPublisher } from '../../services/dataset-onboarding/mockMsw';
import { server } from '../../services/mockServer';
import useSearch from '.';

const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

let wrapper;

const searchOptions = {
    count: (results, { status }) => {
        if (!!results && !!status) {
            const { data } = results;
            return data.counts[status];
        }

        return 0;
    },
    onSuccess: mockOnSuccess,
    onError: mockOnError,
};

describe('Given the useSearch hook', () => {
    describe('When it is run', () => {
        beforeAll(() => {
            server.listen();

            wrapper = testUtils.renderHook(() =>
                useSearch(datasetOnboardingService.useGetPublisher('applicant', { enabled: false }), searchOptions)
            );
        });

        afterEach(() => {
            server.resetHandlers();
        });

        afterAll(() => {
            server.close();
        });

        it('Then contains the correct return values', () => {
            expect(wrapper.result.current).toMatchObject({
                total: 0,
                data: undefined,
                isError: false,
                isFetched: false,
                isLoading: false,
                params: { limit: 10, page: 1 },
            });
        });

        describe('And getResults is called', () => {
            beforeAll(async () => {
                testUtils.act(() => {
                    wrapper.result.current.getResults(
                        {
                            limit: 10,
                            status: 'inReview',
                            search: 'dataset',
                        },
                        'inReview'
                    );
                });

                const { waitForNextUpdate } = wrapper;

                await waitForNextUpdate();
            });

            it.skip('Then sets the loading flag', async () => {
                const { waitFor } = wrapper;
                jest.setTimeout(15000);

                await waitFor(() => expect(wrapper.result.current.isLoading).toEqual(true), 15000);
            });

            it('Then has no previous pages', async () => {
                const { waitFor } = wrapper;

                await waitFor(() => expect(wrapper.result.current.hasPrevious()).toBe(false));
            });

            it('Then has a next page', async () => {
                const { waitFor } = wrapper;

                await waitFor(() => expect(wrapper.result.current.hasNext()).toBe(true));
            });

            it('Then calls onSuccess', () => {
                expect(mockOnSuccess).toHaveBeenCalledWith(mockGetPublisher, {
                    limit: 10,
                    page: 1,
                    status: 'inReview',
                    search: 'dataset',
                });
            });

            describe('And next is clicked', () => {
                beforeAll(async () => {
                    testUtils.act(() => {
                        wrapper.result.current.goToNext();
                    });

                    const { waitForNextUpdate } = wrapper;

                    await waitForNextUpdate();
                });

                it('Then is page 2', async () => {
                    expect(wrapper.result.current.params.page).toBe(2);
                });

                it('Then has a previous page', async () => {
                    expect(wrapper.result.current.hasPrevious()).toBe(true);
                });

                it('Then does not have a next page', async () => {
                    expect(wrapper.result.current.hasNext()).toBe(false);
                });

                describe('And previous is clicked', () => {
                    beforeAll(async () => {
                        testUtils.act(() => {
                            wrapper.result.current.goToPrevious();
                        });

                        const { waitForNextUpdate } = wrapper;

                        await waitForNextUpdate();
                    });

                    it('Then goes back to page 1', async () => {
                        expect(wrapper.result.current.params.page).toBe(1);
                    });
                });

                describe('And there is an error', () => {
                    it('Then calls onError', async () => {
                        wrapper = testUtils.renderHook(() =>
                            useSearch(datasetOnboardingService.useGetPublisher('unknown', { enabled: false }), searchOptions)
                        );

                        testUtils.act(() => {
                            wrapper.result.current.getResults(
                                {
                                    limit: 10,
                                    status: 'inReview',
                                    search: 'dataset',
                                },
                                'inReview'
                            );
                        });

                        await wrapper.waitFor(() => expect(mockOnError).toHaveBeenCalled());
                    });
                });

                describe('And getCachedResults is called', () => {
                    beforeAll(async () => {
                        testUtils.act(() => {
                            wrapper.result.current.getCachedResults(
                                {
                                    status: 'inReview',
                                },
                                'inReview'
                            );
                        });

                        const { waitForNextUpdate } = wrapper;

                        await waitForNextUpdate();
                    });

                    it('Then calls with cached results', async () => {
                        expect(wrapper.result.current.params).toEqual({ limit: 10, page: 1, status: 'inReview' });
                    });
                });
            });
        });
    });
});
