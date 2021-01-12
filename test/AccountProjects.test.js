import AccountProjects from '../src/pages/dashboard/AccountProjects';
import { accountProjectsData } from './mocks/dataMock';
import { userStateData } from './mocks/dataMock';
import moxios from 'moxios';
import { act } from 'react-dom/test-utils';

let wrapper;

describe('<AccountProjects />', () => {
	beforeEach(function () {
		moxios.install();
		wrapper = mount(<AccountProjects userState={userStateData.userState} />);
	});

	afterEach(function () {
		moxios.uninstall();
		wrapper.unmount();
	});

	it('renders with 1 project showing in tab "active"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountProjectsData.data },
				})
				.then(async () => {
					wrapper.update();
					let projectEntryActive = await wrapper.find('[data-testid="projectEntryActive"]').hostNodes();
					expect(projectEntryActive.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 project showing in tab "pending"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountProjectsData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the archive tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="projectTabs"]').at(0).prop('onSelect')('pending');
					});
					// 2. Find Pending Projects
					wrapper.update();
					let projectEntryPending = await wrapper.find('[data-testid="projectEntryPending"]').hostNodes();
					//3. Assert
					expect(projectEntryPending.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 project showing in tab "rejected"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountProjectsData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the rejected tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="projectTabs"]').at(0).prop('onSelect')('rejected');
					});
					// 2. Find Rejected projects
					wrapper.update();
					let projectEntryRejected = await wrapper.find('[data-testid="projectEntryRejected"]').hostNodes();
					// 3. Assert
					expect(projectEntryRejected.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 project showing in tab "archive"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountProjectsData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the archive tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="projectTabs"]').at(0).prop('onSelect')('archive');
					});
					// 2. Find Rejected projects
					wrapper.update();
					let projectEntryArchived = await wrapper.find('[data-testid="projectEntryArchive"]').hostNodes();
					// 3. Assert
					expect(projectEntryArchived.length).toEqual(1);
					done();
				});
		});
	});
});
