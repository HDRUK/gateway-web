import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';
import service from './datasets';

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

    describe('When getDataset is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getDataset('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/datasets/1234`, {
                option1: true,
            });
        });
    });

    describe('When useGetDataset is called', () => {
        it('Then calls getLogout with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getDataset');
            const rendered = renderHook(() => service.useGetDataset('1234', { option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });
});
