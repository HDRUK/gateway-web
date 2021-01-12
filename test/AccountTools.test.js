import AccountTools from '../src/pages/dashboard/AccountTools';
import { accountToolsData } from './mocks/dataMock';
import { userStateData } from './mocks/dataMock';
import moxios from 'moxios';
import { act } from 'react-dom/test-utils';

let wrapper;

beforeEach(function () {
	moxios.install();
	wrapper = mount(<AccountTools userState={userStateData.userState} />);
});

afterEach(function () {
	moxios.uninstall();
	wrapper.unmount();
});

describe('<AccountTools />', () => {
	it('renders with 1 tool showing in tab "active"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountToolsData.data },
				})
				.then(async () => {
					wrapper.update();
					let toolEntryActive = await wrapper.find('[data-testid="toolEntryActive"]').hostNodes();
					expect(toolEntryActive.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 tool showing in tab "pending"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountToolsData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the archive tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="toolTabs"]').at(0).prop('onSelect')('pending');
					});
					// 2. Find Pending Tools
					wrapper.update();
					let toolEntryPending = await wrapper.find('[data-testid="toolEntryPending"]').hostNodes();
					//3. Assert
					expect(toolEntryPending.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 tool showing in tab "rejected"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountToolsData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the rejected tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="toolTabs"]').at(0).prop('onSelect')('rejected');
					});
					// 2. Find Rejected tools
					wrapper.update();
					let toolEntryRejected = await wrapper.find('[data-testid="toolEntryRejected"]').hostNodes();
					// 3. Assert
					expect(toolEntryRejected.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 tool showing in tab "archive"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountToolsData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the archive tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="toolTabs"]').at(0).prop('onSelect')('archive');
					});
					// 2. Find Rejected tools
					wrapper.update();
					let toolEntryArchived = await wrapper.find('[data-testid="toolEntryArchive"]').hostNodes();
					// 3. Assert
					expect(toolEntryArchived.length).toEqual(1);
					done();
				});
		});
	});
});
