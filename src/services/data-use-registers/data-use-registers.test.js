import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiV2URL } from '../../configs/url.config';
import { getRequest, patchRequest, postRequest } from '../../utils/requests';
import service from './data-use-registers';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the papers service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When getDataUseRegisters is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getDataUseRegisters({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiV2URL}/data-use-registers`, {
                option1: true,
            });
        });
    });

    describe('When getDataUseRegistersByTeam is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getDataUseRegistersByTeam('admin', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiV2URL}/data-use-registers?team=admin`, {
                option1: true,
            });
        });
    });

    describe('When getDataUseRegister is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getDataUseRegister('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiV2URL}/data-use-registers/1234?isEdit=true`, {
                option1: true,
            });
        });
    });

    describe('When patchDataUseRegister is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchDataUseRegister(
                '1234',
                { status: 'active' },
                {
                    option1: true,
                }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiV2URL}/data-use-registers/1234`,
                { status: 'active' },
                {
                    option1: true,
                }
            );
        });
    });

    describe('When patchDataUseRegisterCounter is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchDataUseRegisterCounter(
                { status: 'active' },
                {
                    option1: true,
                }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiV2URL}/data-use-registers/counter`,
                { status: 'active' },
                {
                    option1: true,
                }
            );
        });
    });

    describe('When postDataUseRegisterCheck is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postDataUseRegisterCheck(
                { status: 'active' },
                {
                    option1: true,
                }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiV2URL}/data-use-registers/check`,
                { status: 'active' },
                {
                    option1: true,
                }
            );
        });
    });

    describe('When postDataUseRegisterUpload is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postDataUseRegisterUpload(
                { status: 'active' },
                {
                    option1: true,
                }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiV2URL}/data-use-registers/upload`,
                { status: 'active' },
                {
                    option1: true,
                }
            );
        });
    });

    describe('When useGetDataUseRegisters is called', () => {
        it('Then calls getDataUseRegisters with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getDataUseRegisters');
            const rendered = renderHook(() => service.useGetDataUseRegisters({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, getSpy, { option1: true }, { params: { status: 'active' } });
        });
    });

    describe('When useGetDataUseRegistersByTeam is called', () => {
        it('Then calls getDataUseRegistersByTeam with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getDataUseRegistersByTeam');
            const rendered = renderHook(() => service.useGetDataUseRegistersByTeam({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, getSpy, 'admin', { option1: true });
        });
    });

    describe('When usePatchDataUseRegister is called', () => {
        it('Then calls patchDataUseRegister with the correct arguments', async () => {
            const patchSpy = jest.spyOn(service, 'patchDataUseRegister');
            const rendered = renderHook(() => service.usePatchDataUseRegister({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, patchSpy, '1234', { status: 'active' }, { option1: true });
        });
    });

    describe('When usePatchDataUseRegisterCounter is called', () => {
        it('Then calls patchDataUseRegisterCounter with the correct arguments', async () => {
            const patchSpy = jest.spyOn(service, 'patchDataUseRegisterCounter');
            const rendered = renderHook(() => service.usePatchDataUseRegisterCounter({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, patchSpy, { status: 'active' }, { option1: true });
        });
    });

    describe('When usePostDataUseRegisterCheck is called', () => {
        it('Then calls postDataUseRegisterCheck with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postDataUseRegisterCheck');
            const rendered = renderHook(() => service.usePostDataUseRegisterCheck({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'active' }, { option1: true });
        });
    });

    describe('When usePostDataUseRegisterUpload is called', () => {
        it('Then calls postDataUseRegisterUpload with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postDataUseRegisterUpload');
            const rendered = renderHook(() => service.usePostDataUseRegisterUpload({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'active' }, { option1: true });
        });
    });
});
