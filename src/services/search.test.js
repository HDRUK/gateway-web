import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest } from '../utils/requests';
import service from './search';

jest.mock('axios');
jest.mock('../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the search service', () => {
	beforeAll(() => {
		wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
	});

	afterAll(() => {
		wrapper.unmount();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('When getSearch is called', () => {
		it('Then calls getRequest with the correct arguments', async () => {
			await service.getSearch('topic/paper', {
				option1: true,
			});

			expect(getRequest).toHaveBeenCalledWith(`${apiURL}/search/filter/topic/paper`, {
				option1: true,
			});
		});
	});

	describe('When useGetSearch is called', () => {
		it('Then calls getSearch with the correct arguments', async () => {
			const getSpy = jest.spyOn(service, 'getSearch');
			const { waitFor, result } = renderHook(() => service.useGetSearch({ option1: true }), { wrapper });

			await waitFor(() => result.current.mutateAsync);

			result.current.mutateAsync('topic/paper', { status: 'archive' }).then(() => {
				expect(getSpy).toHaveBeenCalledWith(`${apiURL}/search/filter/topic/paper`, {
					option1: true,
					params: { status: 'archive' },
				});
			});
		});
	});
});
