import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { deleteRequest, postRequest, putRequest } from '../../utils/requests';
import service from './workflows';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the auth service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When postWorkflow is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postWorkflow(
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/workflows`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putWorkflow is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putWorkflow(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/workflows/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When deleteDatasetOnboarding is called', () => {
        it('Then calls deleteRequest with the correct arguments', async () => {
            await service.deleteWorkflow('1234', {
                option1: true,
            });

            expect(deleteRequest).toHaveBeenCalledWith(`${apiURL}/workflows/1234`, {
                option1: true,
            });
        });
    });

    describe('When usePostWorkflow is called', () => {
        it('Then calls postWorkflow with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postWorkflow');
            const rendered = renderHook(() => service.usePostWorkflow({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'archive' });
        });
    });

    describe('When usePutWorkflow is called', () => {
        it('Then calls putWorkflow with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putWorkflow');
            const rendered = renderHook(() => service.usePutWorkflow({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When useDeleteWorkflow is called', () => {
        it('Then calls deleteWorkflow with the correct arguments', async () => {
            const deleteSpy = jest.spyOn(service, 'deleteWorkflow');
            const rendered = renderHook(() => service.useDeleteWorkflow({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, deleteSpy, '1234');
        });
    });
});
