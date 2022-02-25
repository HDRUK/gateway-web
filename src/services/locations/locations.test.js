import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';
import service from './locations';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the datasets service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getLocations is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getLocations('lond', {
                withCredentials: false,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/locations/lond`, {
                withCredentials: false,
            });
        });
    });

    describe('When useGetLocations is called', () => {
        it('Then calls getLocations with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getLocations');
            const rendered = renderHook(() => service.useGetLocations('lond', { withCredentials: false }), { wrapper });
            assertServiceRefetchCalled(rendered, getSpy, 'lond');
        });
    });
});
