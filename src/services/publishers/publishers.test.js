import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';
import service from './publishers';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the person service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getPublisher is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getPublisher('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/publishers/1234`, {
                option1: true,
            });
        });
    });

    describe('When patchModalContent is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchModalContent(
                '1234',
                { status: 'archive ' },
                {
                    option1: true,
                }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/publishers/dataRequestModalContent/1234`,
                { status: 'archive ' },
                {
                    option1: true,
                }
            );
        });
    });

    describe('When useGetPublisher is called', () => {
        it('Then calls getPersons with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getPublisher');
            const rendered = renderHook(() => service.useGetPublisher('1234', { wrapper }));

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePatchModalContent is called', () => {
        it('Then calls patchModalContent with the correct arguments', async () => {
            const patchSpy = jest.spyOn(service, 'patchModalContent');
            const rendered = renderHook(() => service.usePatchModalContent({ _id: '1234', option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, patchSpy, '1234', { status: 'archive' });
        });
    });
});
