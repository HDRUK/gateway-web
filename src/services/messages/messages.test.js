import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';
import service from './messages';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the person service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getMessages is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getMessages({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/messages`, {
                option1: true,
            });
        });
    });

    describe('When getMessage is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getMessage('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/messages/1234`, {
                option1: true,
            });
        });
    });

    describe('When getUnreadCount is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getUnreadCount({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/messages/unread/count`, {
                option1: true,
            });
        });
    });

    describe('When postMessage is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postMessage(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/messages/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When postMarkAsRead is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postMarkAsRead(
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/messages/markasread`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putMessage is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putMessage(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/messages/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchMessage is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchMessage(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/messages/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When deleteMessage is called', () => {
        it('Then calls deleteRequest with the correct arguments', async () => {
            await service.deleteMessage('1234', {
                option1: true,
            });

            expect(deleteRequest).toHaveBeenCalledWith(`${apiURL}/messages/1234`, {
                option1: true,
            });
        });
    });

    describe('When useGetMessages is called', () => {
        it('Then calls getMessages with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getMessages');
            const rendered = renderHook(() => service.useGetMessages({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetMessage is called', () => {
        it('Then calls getMessage with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getMessage');
            const rendered = renderHook(() => service.useGetMessage({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When useGetUnreadCount is called', () => {
        it('Then calls getUnreadCount with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getUnreadCount');
            const rendered = renderHook(() => service.useGetUnreadCount({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When usePostMessage is called', () => {
        it('Then calls postMessage with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postMessage');
            const rendered = renderHook(() => service.usePostMessage({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePostMarkAsRead is called', () => {
        it('Then calls postMessage with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postMarkAsRead');
            const rendered = renderHook(() => service.usePostMarkAsRead({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'archive' });
        });
    });

    describe('When usePutMessage is called', () => {
        it('Then calls putMessage with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putMessage');
            const rendered = renderHook(() => service.usePutMessage({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePatchMessage is called', () => {
        it('Then calls patchMessage with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'patchMessage');
            const rendered = renderHook(() => service.usePatchMessage({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When useDeleteMessage is called', () => {
        it('Then calls deleteMessage with the correct arguments', async () => {
            const deleteSpy = jest.spyOn(service, 'deleteMessage');
            const rendered = renderHook(() => service.useDeleteMessage({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, deleteSpy, '1234');
        });
    });
});
