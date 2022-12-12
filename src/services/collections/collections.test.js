import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest, postRequest } from '../../utils/requests';
import service from './collections';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the collections service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getCollectionRequest is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getCollectionRequest('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/collections/1234`, {
                option1: true,
            });
        });
    });

    describe('When getCollectionRelatedObjectsRequest is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getCollectionRelatedObjectsRequest('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/collections/relatedobjects/1234`, {
                option1: true,
            });
        });
    });

    describe('When postCollectionCounterUpdateRequest is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postCollectionCounterUpdateRequest(100, { id: 1234, option1: true });

            expect(postRequest).toHaveBeenCalledWith(`${apiURL}/collectioncounter/update`, 100, { id: 1234, option1: true });
        });
    });

    describe('When useGetCollectionRequest is called', () => {
        it('Then calls getCollectionRequest with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getCollectionRequest');
            const rendered = renderHook(() => service.useGetCollectionRequest('1234', { option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When useGetCollectionRelatedObjectsRequest is called', () => {
        it('Then calls getCollectionRelatedObjectsRequest with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getCollectionRelatedObjectsRequest');
            const rendered = renderHook(() => service.useGetCollectionRelatedObjectsRequest('1234', { option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePostCollectionCounterUpdateRequest is called', () => {
        it('Then calls postCollectionCounterUpdateRequest with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postCollectionCounterUpdateRequest');
            const rendered = renderHook(() => service.usePostCollectionCounterUpdateRequest({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'archive' });
        });
    });
});
