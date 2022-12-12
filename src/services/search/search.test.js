import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL, apiV2URL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';
import service from './search';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the search service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getSearch is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getSearch({
                params: {
                    search: 'search term',
                },
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/search`, {
                params: {
                    search: 'search term',
                },
            });
        });
    });

    describe('When getTopic is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getTopic('paper', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/search/filter/topic/paper`, {
                option1: true,
            });
        });
    });

    describe('When getFilters is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getFilters('paper', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiV2URL}/filters/paper`, {
                option1: true,
            });
        });
    });

    describe('When getSearchFilters is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getSearchFilters({
                params: {
                    search: 'test',
                    tab: 'Dataset',
                },
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/search/filter`, {
                option1: true,
                params: {
                    search: 'test',
                    tab: 'Dataset',
                },
            });
        });
    });

    describe('When useGetSearch is called', () => {
        it('Then calls getSearch with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getSearch');
            const rendered = renderHook(() => service.useGetSearch({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, { params: { search: 'search term' } });
        });
    });

    describe('When useGetTopic is called', () => {
        it('Then calls getTopic with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getTopic');
            const rendered = renderHook(() => service.useGetTopic({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, 'paper', { option1: true });
        });
    });

    describe('When useGetFilters is called', () => {
        it('Then calls getTopic with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getFilters');
            const rendered = renderHook(() => service.useGetFilters({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, 'paper', { option1: true });
        });
    });

    describe('When useGetSearchFilters is called', () => {
        it('Then calls getTopic with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getSearchFilters');
            const rendered = renderHook(() => service.useGetSearchFilters({ option1: true }), { wrapper });
            assertServiceRefetchCalled(rendered, getSpy, { option1: true });
        });
    });
});
