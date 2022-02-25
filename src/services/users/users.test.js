import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest, patchRequest } from '../../utils/requests';
import service from './users';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the users service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getUsers is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getUsers({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/users`, {
                option1: true,
            });
        });
    });

    describe('When patchRoles is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchRoles(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/users/advancedsearch/roles/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchTerms is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchTerms(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/users/advancedsearch/terms/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When useGetUsers is called', () => {
        it('Then calls getUsers with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getUsers');
            const rendered = renderHook(() => service.useGetUsers({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When usePatchRoles is called', () => {
        it('Then calls patchRoles with the correct arguments', async () => {
            const patchSpy = jest.spyOn(service, 'patchRoles');
            const rendered = renderHook(() => service.usePatchRoles({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, patchSpy, '1234', { status: 'archive' });
        });
    });

    describe('When patchTerms is called', () => {
        it('Then calls patchTerms with the correct arguments', async () => {
            const patchSpy = jest.spyOn(service, 'patchTerms');
            const rendered = renderHook(() => service.usePatchTerms({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, patchSpy, '1234', { status: 'archive' });
        });
    });
});
