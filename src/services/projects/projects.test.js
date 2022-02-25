import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';
import service from './projects';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the projects service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getProjects is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getProjects({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/projects/getList`, {
                option1: true,
            });
        });
    });

    describe('When getProject is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getProject('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/projects/1234`, {
                option1: true,
            });
        });
    });

    describe('When postProject is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postProject(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/projects/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putProject is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putProject(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/projects/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchProject is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchProject(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/projects/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When deleteProject is called', () => {
        it('Then calls deleteRequest with the correct arguments', async () => {
            await service.deleteProject('1234', {
                option1: true,
            });

            expect(deleteRequest).toHaveBeenCalledWith(`${apiURL}/projects/1234`, {
                option1: true,
            });
        });
    });

    describe('When useGetProjects is called', () => {
        it('Then calls getProjects with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getProjects');
            const rendered = renderHook(() => service.useGetProjects({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetProject is called', () => {
        it('Then calls getProject with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getProject');
            const rendered = renderHook(() => service.useGetProject({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePostProject is called', () => {
        it('Then calls postProject with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postProject');
            const rendered = renderHook(() => service.usePostProject({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePutProject is called', () => {
        it('Then calls putProject with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putProject');
            const rendered = renderHook(() => service.usePutProject({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePatchProject is called', () => {
        it('Then calls patchProject with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'patchProject');
            const rendered = renderHook(() => service.usePatchProject({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When useDeleteProject is called', () => {
        it('Then calls deleteProject with the correct arguments', async () => {
            const deleteSpy = jest.spyOn(service, 'deleteProject');
            const rendered = renderHook(() => service.useDeleteProject({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, deleteSpy, '1234');
        });
    });
});
