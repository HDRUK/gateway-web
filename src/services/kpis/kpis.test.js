import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';
import service from './kpis';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the kpis service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getKpis is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getKpis({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/kpis`, {
                option1: true,
            });
        });
    });

    describe('When useGetKpis is called', () => {
        it('Then calls getKpis with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getKpis');
            const rendered = renderHook(() => service.useGetKpis({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });
});
