import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiV2URL } from '../../configs/url.config';
import { getRequest, patchRequest, postRequest } from '../../utils/requests';
import service from './questionbank';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the data-access-request service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getQuestionbankItem is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getQuestionbankItem('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiV2URL}/questionbank/1234`, {
                option1: true,
            });
        });
    });

    describe('When postQuestionbankItem is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postQuestionbankItem(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiV2URL}/questionbank/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchClearAll is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchClearAll('1234', { option1: true });

            expect(patchRequest).toHaveBeenCalledWith(`${apiV2URL}/questionbank/1234`, { option1: true });
        });
    });

    describe('When patchClearSection is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchClearSection('1234', 'safepeople', { option1: true });

            expect(patchRequest).toHaveBeenCalledWith(`${apiV2URL}/questionbank/1234?page=safepeople`, { option1: true });
        });
    });

    describe('When useGetQuestionbankItem is called', () => {
        it('Then calls getQuestionbankItem with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getQuestionbankItem');
            const rendered = renderHook(() => service.useGetQuestionbankItem({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePostQuestionbankItem is called', () => {
        it('Then calls postQuestionbankItem with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postQuestionbankItem');
            const rendered = renderHook(() => service.usePostQuestionbankItem({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePatchClearAll is called', () => {
        it('Then calls patchClearAll with the correct arguments', async () => {
            const patchSpy = jest.spyOn(service, 'patchClearAll');
            const rendered = renderHook(() => service.usePatchClearAll({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, patchSpy, '1234');
        });
    });

    describe('When usePatchClearSection is called', () => {
        it('Then calls patchClearSection with the correct arguments', async () => {
            const patchSpy = jest.spyOn(service, 'patchClearSection');
            const rendered = renderHook(() => service.usePatchClearSection({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, patchSpy, { id: '1234', questionSetId: 'safepeople' });
        });
    });
});
