import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest, postRequest, putRequest } from '../../utils/requests';
import service from './course';

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

    describe('When getCourse is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getCourse('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/course/1234`, {
                option1: true,
            });
        });
    });

    describe('When getEdit is called', () => {
        it('Then calls getRequest with the correct arguments', async () => {
            await service.getEdit('1234', {
                option1: true,
            });

            expect(getRequest).toHaveBeenCalledWith(`${apiURL}/course/edit/1234`, {
                option1: true,
            });
        });
    });

    describe('When postCourse is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postCourse(
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(postRequest).toHaveBeenCalledWith(
                `${apiURL}/course`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When putCourse is called', () => {
        it('Then calls putRequest with the correct arguments', async () => {
            await service.putCourse(
                '1234',
                {
                    status: 'archive',
                },
                { option1: true }
            );

            expect(putRequest).toHaveBeenCalledWith(
                `${apiURL}/course/1234`,
                {
                    status: 'archive',
                },
                { option1: true }
            );
        });
    });

    describe('When useGetCourse is called', () => {
        it('Then calls getCourse with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getCourse');
            const rendered = renderHook(() => service.useGetCourse({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When useGetEdit is called', () => {
        it('Then calls getEdit with the correct arguments', async () => {
            const getSpy = jest.spyOn(service, 'getEdit');
            const rendered = renderHook(() => service.useGetEdit({ option1: true }), { wrapper });

            assertServiceRefetchCalled(rendered, getSpy, '1234');
        });
    });

    describe('When usePostCourse is called', () => {
        it('Then calls postCourse with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postCourse');
            const rendered = renderHook(() => service.usePostCourse({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, { status: 'archive' });
        });
    });

    describe('When usePutCourse is called', () => {
        it('Then calls putCourse with the correct arguments', async () => {
            const putSpy = jest.spyOn(service, 'putCourse');
            const rendered = renderHook(() => service.usePutCourse({ option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, putSpy, '1234', { status: 'archive' });
        });
    });
});
