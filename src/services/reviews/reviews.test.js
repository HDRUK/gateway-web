import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';
import service from './reviews';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the reviews service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getReviews is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getReviews({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/reviews`, {
                option1: true,
            });
        });
    });

    describe('When getTool is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getPending({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/reviews/pending`, {
                option1: true,
            });
        });
    });

    describe('When getAdminPending is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getAdminPending({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/reviews/admin/pending`, {
                option1: true,
            });
        });
    });

    describe('When useGetReviews is called', () => {
        it('Then calls getReviews with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getReviews');
            const rendered = renderHook(() => service.useGetReviews({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetPending is called', () => {
        it('Then calls getPending with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getPending');
            const rendered = renderHook(() => service.useGetPending({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetAdminPending is called', () => {
        it('Then calls getAdminPending with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getAdminPending');
            const rendered = renderHook(() => service.useGetAdminPending({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });
});
