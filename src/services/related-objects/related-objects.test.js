import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';
import service from './related-objects';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the related objects service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getRelatedObject is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getRelatedObject('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/relatedobject/1234`, {
                option1: true,
            });
        });
    });

    describe('When getRelatedObjectByType is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getRelatedObjectByType('1234', 'type', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/relatedobject/type/1234`, {
                option1: true,
            });
        });
    });

    describe('When getLinkedDatasets is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getLinkedDatasets('5678', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/relatedobject/linkeddatasets/5678`, {
                option1: true,
            });
        });
    });

    describe('When useGetRelatedObject is called', () => {
        it('Then calls getRelatedObject with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getRelatedObject');
            const rendered = renderHook(() => service.useGetRelatedObject({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When useGetLinkedDatasets is called', () => {
        it('Then calls getLinkedDatasets with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getLinkedDatasets');
            const rendered = renderHook(() => service.useGetLinkedDatasets({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '5678');
        });
    });
});
