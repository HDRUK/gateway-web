import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';
import service from './dataset-onboarding';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the dataset-onboarding service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getDatasetOnboardings is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getDatasetOnboardings({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/dataset-onboarding`, {
                option1: true,
            });
        });
    });

    describe('When getDatasetOnboarding is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getDatasetOnboarding('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/dataset-onboarding/1234`, {
                option1: true,
            });
        });
    });

    describe('When getPublisher is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getPublisher('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/dataset-onboarding/publisher/1234`, {
                option1: true,
            });
        });
    });

    describe('When postDatasetOnboarding is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            const commonArgs = [
                {
                    publisherID: 'admin',
                },
                { option1: true },
            ];

            await service.postDatasetOnboarding(...commonArgs);

            expect(postRequest).toHaveBeenCalledWith(`${apiURL}/dataset-onboarding`, ...commonArgs);
        });
    });

    describe('When postDuplicate is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postDuplicate(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/dataset-onboarding/duplicate/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putDatasetOnboarding is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putDatasetOnboarding(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/dataset-onboarding/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchDatasetOnboarding is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchDatasetOnboarding(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/dataset-onboarding/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When deleteDatasetOnboarding is called', () => {
        it('Then calls deleteRequest with the correct arguments', async () => {
            await service.deleteDatasetOnboarding('1234', {
                option1: true,
            });

            expect(deleteRequest).toHaveBeenCalledWith(`${apiURL}/dataset-onboarding/delete/1234`, {
                option1: true,
            });
        });
    });

    describe('When useGetDatasetOnboardings is called', () => {
        it('Then calls getDatasetOnboardings with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getDatasetOnboardings');
            const rendered = renderHook(() => service.useGetDatasetOnboardings({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetDatasetOnboarding is called', () => {
        it('Then calls getDatasetOnboarding with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getDatasetOnboarding');
            const rendered = renderHook(() => service.useGetDatasetOnboarding({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When useGetPublisher is called', () => {
        it('Then calls useGetPublisher with the correct arguments', () => {
            const getSpy = jest.spyOn(service, 'getPublisher');
            const rendered = renderHook(() => service.useGetPublisher({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, getSpy, '1234', {
                search: 'dataset',
            });
        });
    });

    describe('When usePostDatasetOnboarding is called', () => {
        it('Then calls postDatasetOnboarding with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postDatasetOnboarding');
            const commonArgs = [{ publisherID: 'admin' }];
            const rendered = renderHook(() => service.usePostDatasetOnboarding(...commonArgs), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, ...commonArgs, { option1: true });
        });
    });

    describe('When usePostDuplicate is called', () => {
        it('Then calls postDuplicate with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postDuplicate');
            const rendered = renderHook(() => service.usePostDuplicate({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePutDatasetOnboarding is called', () => {
        it('Then calls putDatasetOnboarding with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putDatasetOnboarding');
            const rendered = renderHook(() => service.usePutDatasetOnboarding({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePatchDatasetOnboarding is called', () => {
        it('Then calls patchDatasetOnboarding with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'patchDatasetOnboarding');
            const rendered = renderHook(() => service.usePatchDatasetOnboarding({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When useDeleteDatasetOnboarding is called', () => {
        it('Then calls deleteDatasetOnboarding with the correct arguments', async () => {
            const deleteSpy = jest.spyOn(service, 'deleteDatasetOnboarding');
            const rendered = renderHook(() => service.useDeleteDatasetOnboarding({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, deleteSpy, '1234');
        });
    });
});
