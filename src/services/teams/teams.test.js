import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest, postRequest, putRequest } from '../../utils/requests';
import service from './teams';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the teams service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getMembers is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getMembers('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/teams/1234/members`, {
                option1: true,
            });
        });
    });

    describe('When getNotifications is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getNotifications('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/teams/1234/notifications`, {
                option1: true,
            });
        });
    });

    describe('When postAdd is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postAdd(
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/teams/add`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putTeam is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putTeam(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/teams/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putNotificationMessage is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putNotificationMessage(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/teams/1234/notification-messages`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putNotifications is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putNotifications(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/teams/1234/notifications`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When useGetMembers is called', () => {
        it('Then calls getMembers with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getMembers');
            const rendered = renderHook(() => service.useGetMembers({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When useGetNotifications is called', () => {
        it('Then calls getMembers with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getNotifications');
            const rendered = renderHook(() => service.useGetNotifications({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePostAdd is called', () => {
        it('Then calls postAdd with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postAdd');
            const rendered = renderHook(() => service.usePostAdd({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'archive' });
        });
    });

    describe('When usePutTeam is called', () => {
        it('Then calls putTeam with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putTeam');
            const rendered = renderHook(() => service.usePutTeam({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePutNotificationMessage is called', () => {
        it('Then calls putNotificationMessage with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putNotificationMessage');
            const rendered = renderHook(() => service.usePutNotificationMessage({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePutNotifications is called', () => {
        it('Then calls putNotifications with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putNotifications');
            const rendered = renderHook(() => service.usePutNotifications({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });
});
