import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';
import service from './analyticsdashboard';

jest.mock('axios');
jest.mock('../../utils/requests');

let wrapper;

const queryClient = new QueryClient();

describe('Given the analyticsdashboard service', () => {
	beforeAll(() => {
		wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
	});

	afterAll(() => {
		wrapper.unmount();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('When getTotalUsers is called', () => {
		it('Then calls getRequest with the correct arguments', async () => {
			await service.getTotalUsers({
				option1: true,
			});

			expect(getRequest).toHaveBeenCalledWith(`${apiURL}/analyticsdashboard/totalusers`, {
				option1: true,
			});
		});
	});

	describe('When getUsersPerMonth is called', () => {
		it('Then calls getRequest with the correct arguments', async () => {
			await service.getUsersPerMonth({
				option1: true,
			});

			expect(getRequest).toHaveBeenCalledWith(`${apiURL}/analyticsdashboard/userspermonth`, {
				option1: true,
			});
		});
	});

	describe('When useGetTotalUsers is called', () => {
		it('Then calls getUsersPerMonth with the correct arguments', async () => {
			const getSpy = jest.spyOn(service, 'getTotalUsers');
			const rendered = renderHook(() => service.useGetTotalUsers({ option1: true }), { wrapper });

			assertServiceRefetchCalled(rendered, getSpy);
		});
	});

	describe('When useGetUsersPerMonth is called', () => {
		it('Then calls getUsersPerMonth with the correct arguments', async () => {
			const getSpy = jest.spyOn(service, 'getUsersPerMonth');
			const rendered = renderHook(() => service.useGetUsersPerMonth({ option1: true }), { wrapper });

			assertServiceRefetchCalled(rendered, getSpy);
		});
	});
});
