import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';
import service from './topics';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the topics service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getTopics is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getTopics({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/topics`, {
                option1: true,
            });
        });
    });

    describe('When getTopic is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getTopic('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/topics/1234`, {
                option1: true,
            });
        });
    });

    describe('When postTopic is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postTopic(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/topics/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putTopic is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putTopic(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/topics/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchTopic is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchTopic(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/topics/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When deleteTopic is called', () => {
        it('Then calls deleteRequest with the correct arguments', async () => {
            await service.deleteTopic('1234', {
                option1: true,
            });

            expect(deleteRequest).toHaveBeenCalledWith(`${apiURL}/topics/1234`, {
                option1: true,
            });
        });
    });

    describe('When useGetTopics is called', () => {
        it('Then calls getTopics with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getTopics');
            const rendered = renderHook(() => service.useGetTopics({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetTopic is called', () => {
        it('Then calls getTopic with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getTopic');
            const rendered = renderHook(() => service.useGetTopic({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePostTopic is called', () => {
        it('Then calls postTopic with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postTopic');
            const rendered = renderHook(() => service.usePostTopic({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePutTopic is called', () => {
        it('Then calls putTopic with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putTopic');
            const rendered = renderHook(() => service.usePutTopic({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePatchTopic is called', () => {
        it('Then calls patchTopic with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'patchTopic');
            const rendered = renderHook(() => service.usePatchTopic({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When useDeleteTopic is called', () => {
        it('Then calls deleteTopic with the correct arguments', async () => {
            const deleteSpy = jest.spyOn(service, 'deleteTopic');
            const rendered = renderHook(() => service.useDeleteTopic({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, deleteSpy, '1234');
        });
    });
});
