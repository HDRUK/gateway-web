import { QueryClient, QueryClientProvider } from 'react-query';
import { getRequest } from '../../utils/requests';
import service from './content';
import { UATCMSURL } from './content.constants';

jest.doMock('../../pages/commonComponents/BaseURL', () => ({
    default: () => {},
    getCMSURL: jest.fn().mockImplementation(() => {}),
    getURLEnv: jest.fn().mockImplementation(() => {}),
}));
const baseURL = require('../../pages/commonComponents/BaseURL');

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;
const cmsURL = 'cmsUrl';

const queryClient = new QueryClient();

describe('Given the Content Service', () => {
    beforeAll(() => {
        wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    });

    afterAll(() => {
        wrapper.unmount();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    describe('When getNon5SafesModalContentRequest is called', () => {
        describe('And the environment is local', () => {
            it('Then calls getRequest with the correct arguments', async () => {
                baseURL.getURLEnv.mockReturnValue('local');

                await service.getNon5SafesModalContentRequest({
                    option1: true,
                });

                expect(getRequest).toHaveBeenCalledWith(`${UATCMSURL}/Non5SafesModalContent`, {
                    option1: true,
                });
            });
        });

        describe('And the environment is not local', () => {
            beforeEach(() => {
                jest.resetModules();
            });

            it('Then calls getRequest with the correct arguments', async () => {
                baseURL.getCMSURL.mockReturnValue(cmsURL);
                baseURL.getURLEnv.mockReturnValue('production');

                await service.getNon5SafesModalContentRequest({
                    option1: true,
                });

                expect(getRequest).toHaveBeenCalledWith(`${cmsURL}/Non5SafesModalContent`, {
                    option1: true,
                });
            });
        });
    });
});
