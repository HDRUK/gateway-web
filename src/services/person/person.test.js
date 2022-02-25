import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';
import service from './person';

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

    describe('When getPersons is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getPersons({
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/person`, {
                option1: true,
            });
        });
    });

    describe('When getPerson is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getPerson('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/person/1234`, {
                option1: true,
            });
        });
    });

    describe('When postPerson is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postPerson(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/person/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putPerson is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putPerson(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/person/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putUnsubscribe is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putUnsubscribe(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/person/unsubscribe/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchPerson is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchPerson(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/person/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When patchProfileComplete is called', () => {
        it('Then calls patchRequest with the correct arguments', async () => {
            await service.patchProfileComplete(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(patchRequest).toHaveBeenCalledWith(
                `${apiURL}/person/profileComplete/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When deletePerson is called', () => {
        it('Then calls deleteRequest with the correct arguments', async () => {
            await service.deletePerson('1234', {
                option1: true,
            });

            expect(deleteRequest).toHaveBeenCalledWith(`${apiURL}/person/1234`, {
                option1: true,
            });
        });
    });

    describe('When useGetPersons is called', () => {
        it('Then calls getPersons with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getPersons');
            const rendered = renderHook(() => service.useGetPersons({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy);
        });
    });

    describe('When useGetPerson is called', () => {
        it('Then calls getPerson with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getPerson');
            const rendered = renderHook(() => service.useGetPerson({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePostPerson is called', () => {
        it('Then calls postPerson with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postPerson');
            const rendered = renderHook(() => service.usePostPerson({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePutPerson is called', () => {
        it('Then calls putPerson with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putPerson');
            const rendered = renderHook(() => service.usePutPerson({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePutUnsubscribe is called', () => {
        it('Then calls putUnsubscribe with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putUnsubscribe');
            const rendered = renderHook(() => service.usePutUnsubscribe({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePatchPerson is called', () => {
        it('Then calls patchPerson with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'patchPerson');
            const rendered = renderHook(() => service.usePatchPerson({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When usePatchProfileComplete is called', () => {
        it('Then calls patchPerson with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'patchProfileComplete');
            const rendered = renderHook(() => service.usePatchProfileComplete({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });

    describe('When useDeletePerson is called', () => {
        it('Then calls deletePerson with the correct arguments', async () => {
            const deleteSpy = jest.spyOn(service, 'deletePerson');
            const rendered = renderHook(() => service.useDeletePerson({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, deleteSpy, '1234');
        });
    });
});
