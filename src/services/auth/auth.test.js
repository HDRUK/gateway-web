import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest, postRequest } from '../../utils/requests';
import service from './auth';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the auth service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getStatus is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getLogout({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/auth/logout`, {
                option1: true,
            });
        });
    });

    describe('When getLogout is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getLogout({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/auth/logout`, {
                option1: true,
            });
        });
    });

    describe('When postRegister is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postRegister(
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/auth/register`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When useGetStatus is called', () => {
        it('Then calls getStatus with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getStatus');
            const rendered = renderHook(() => service.useGetStatus({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetLogout is called', () => {
        it('Then calls getLogout with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getLogout');
            const rendered = renderHook(() => service.useGetLogout({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When usePostRegister is called', () => {
        it('Then calls postRegister with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postRegister');
            const rendered = renderHook(() => service.usePostRegister({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'archive' });
        });
    });
});
