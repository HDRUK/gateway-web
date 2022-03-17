import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiV2URL } from '../../configs/url.config';
import { postRequest } from '../../utils/requests';
import service from './activitylog';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

const mockBody = {
    versionIds: ['1234', '5678'],
    type: 'datasets',
};

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

    describe('When postActivityLog is called', () => {
        it('Then calls postRequest with the correct arguments', async () => {
            await service.postActivityLog(mockBody, {
                option1: true,
            });

            expect(postRequest).toHaveBeenCalledWith(`${apiV2URL}/activitylog`, mockBody, {
                option1: true,
            });
        });
    });

    describe('When usePostActivityLog is called', () => {
        it('Then calls postActivityLog with the correct arguments', async () => {
            const postSpy = jest.spyOn(service, 'postActivityLog');
            const rendered = renderHook(() => service.usePostActivityLog(mockBody, { option1: true }), { wrapper });

            assertServiceMutateAsyncCalled(rendered, postSpy, mockBody);
        });
    });
});
