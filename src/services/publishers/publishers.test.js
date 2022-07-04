import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';
import service from './publishers';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the projects service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When patchPublisherDataUseWidget is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchPublisherDataUseWidget(
                '1234',
                {
                    accepted: true,
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/publishers/1234/dataUseWidget`,
                {
                    accepted: true,
                },
                { option1: true }
            );
        });
    });

    describe('When usePatchPublisherDataUseWidget is called', () => {
        it('Then calls patchProject with the correct arguments', async () => {
            const patchSpy = jest.spyOn(service, 'patchPublisherDataUseWidget');
            const rendered = renderHook(() => service.usePatchPublisherDataUseWidget({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalledWithDifferentArgs(
                rendered,
                patchSpy,
                [{ _id: '1234', accepted: true }],
                ['1234', { accepted: true }, { option1: true }]
            );
        });
    });
});
