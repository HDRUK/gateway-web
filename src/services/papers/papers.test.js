import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL, apiV2URL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';
import service from './papers';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the papers service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getPapers is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getPapers({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiV2URL}/papers`, {
                option1: true,
            });
        });
    });

    describe('When getPaper is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getPaper('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/papers/1234`, {
                option1: true,
            });
        });
    });

    describe('When getEdit is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getEdit('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/papers/edit/1234`, {
                option1: true,
            });
        });
    });

    describe('When postPaper is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postPaper(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/papers/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putPaper is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putPaper(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/papers/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchPaper is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchPaper(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/papers/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When deletePaper is called', () => {
        it('Then calls deleteRequest with the correct arguments', async () => {
            await service.deletePaper('1234', {
                option1: true,
            });

            expect(deleteRequest).toHaveBeenCalledWith(`${apiURL}/papers/1234`, {
                option1: true,
            });
        });
    });

    describe('When useGetPapers is called', () => {
        it('Then calls getPapers with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getPapers');
            const rendered = renderHook(() => service.useGetPapers({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetPaper is called', () => {
        it('Then calls getPaper with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getPaper');
            const rendered = renderHook(() => service.useGetPaper({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When useGetEdit is called', () => {
        it('Then calls getPaper with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getEdit');
            const rendered = renderHook(() => service.useGetEdit({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePostPaper is called', () => {
        it('Then calls postPaper with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postPaper');
            const rendered = renderHook(() => service.usePostPaper({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePutPaper is called', () => {
        it('Then calls putPaper with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putPaper');
            const rendered = renderHook(() => service.usePutPaper({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePatchPaper is called', () => {
        it('Then calls patchPaper with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'patchPaper');
            const rendered = renderHook(() => service.usePatchPaper({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When useDeletePaper is called', () => {
        it('Then calls deletePaper with the correct arguments', async () => {
            const deleteSpy = jest.spyOn(service, 'deletePaper');
            const { waitFor, result } = renderHook(() => service.useDeletePaper({ option1: true }), { wrapper });

            await waitFor(() => result.current.refetch);

            result.current.refetch('1234').then(() => {
                expect(deleteSpy).toHaveBeenCalledWith('1234');
            });
        });
    });
});
