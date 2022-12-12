import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';
import service from './contributors';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the contributors service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getContributorsInfo is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getContributorsInfo('123', {
                option1: true,
            });
            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/data-access-request/prepopulate-contributors/123`, {
                option1: true,
            });
        });
    });

    describe('When useGetSearch is called', () => {
        it('Then calls getSearch with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getContributorsInfo');
            const rendered = renderHook(() => service.useGetContributorsInfo({ option1: true }), { wrapper });
            assertServiceRefetchCalled(rendered, getSpy);
        });
    });
});
