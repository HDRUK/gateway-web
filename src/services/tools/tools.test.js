import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL, apiV2URL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';
import service from './tools';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the tools service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getTools is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getTools({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiV2URL}/tools`, {
                option1: true,
            });
        });
    });

    describe('When getTool is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getTool('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/tools/1234`, {
                option1: true,
            });
        });
    });

    describe('When getToolEdit is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getToolEdit('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/tools/edit/1234`, {
                option1: true,
            });
        });
    });

    describe('When getProjectTag is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getProjectTag('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/tools/project/tag/1234`, {
                option1: true,
            });
        });
    });

    describe('When postTool is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postTool(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/tools/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When postReviewAdd is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postReviewAdd(
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/tools/review/add`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When postToolsReply is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postToolsReply(
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/tools/reply`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putTool is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putTool(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/tools/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putReviewApprove is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putReviewApprove(
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/tools/review/approve`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchTool is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchTool(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/tools/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When deleteTool is called', () => {
        it('Then calls deleteRequest with the correct arguments', async () => {
            await service.deleteTool('1234', {
                option1: true,
            });

            expect(deleteRequest).toHaveBeenCalledWith(`${apiURL}/tools/1234`, {
                option1: true,
            });
        });
    });

    describe('When useGetTools is called', () => {
        it('Then calls getTools with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getTools');
            const rendered = renderHook(() => service.useGetTools({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetToolEdit is called', () => {
        it('Then calls getTools with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getToolEdit');
            const rendered = renderHook(() => service.useGetToolEdit({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When useGetProjectTag is called', () => {
        it('Then calls getProjectTag with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getProjectTag');
            const rendered = renderHook(() => service.useGetProjectTag({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When useGetTool is called', () => {
        it('Then calls getTool with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getTool');
            const rendered = renderHook(() => service.useGetTool({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePostTool is called', () => {
        it('Then calls postTool with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postTool');
            const rendered = renderHook(() => service.usePostTool({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePostReviewAdd is called', () => {
        it('Then calls postReviewAdd with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postReviewAdd');
            const rendered = renderHook(() => service.usePostReviewAdd({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'archive' });
        });
    });

    describe('When usePostToolsReply is called', () => {
        it('Then calls postToolsReply with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postToolsReply');
            const rendered = renderHook(() => service.usePostToolsReply({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'archive' });
        });
    });

    describe('When usePutTool is called', () => {
        it('Then calls putTool with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putTool');
            const rendered = renderHook(() => service.usePutTool({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePutReviewApprove is called', () => {
        it('Then calls putReviewApprove with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putReviewApprove');
            const rendered = renderHook(() => service.usePutReviewApprove({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, { status: 'archive' });
        });
    });

    describe('When usePatchTool is called', () => {
        it('Then calls patchTool with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'patchTool');
            const rendered = renderHook(() => service.usePatchTool({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When useDeleteTool is called', () => {
        it('Then calls deleteTool with the correct arguments', async () => {
            const deleteSpy = jest.spyOn(service, 'deleteTool');
            const rendered = renderHook(() => service.useDeleteTool({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, deleteSpy, '1234');
        });
    });
});
