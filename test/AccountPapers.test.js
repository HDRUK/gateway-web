import AccountPapers from '../src/pages/dashboard/AccountPapers';
import { accountPapersData } from './mocks/dataMock';
import { userStateData } from './mocks/dataMock';
import moxios from 'moxios';
import { act } from 'react-dom/test-utils';

let wrapper;

describe('<AccountPapers />', () => {
	beforeEach(function () {
		moxios.install();
		wrapper = mount(<AccountPapers userState={userStateData.userState} />);
	});

	afterEach(function () {
		moxios.uninstall();
		wrapper.unmount();
	});

	it('renders with 1 paper showing in tab "active"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountPapersData.data },
				})
				.then(async () => {
					wrapper.update();
					let paperEntryActive = await wrapper.find('[data-testid="paperEntryActive"]').hostNodes();
					expect(paperEntryActive.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 paper showing in tab "pending"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountPapersData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the archive tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="paperTabs"]').at(0).prop('onSelect')('pending');
					});
					// 2. Find Pending Papers
					wrapper.update();
					let paperEntryPending = await wrapper.find('[data-testid="paperEntryPending"]').hostNodes();
					//3. Assert
					expect(paperEntryPending.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 paper showing in tab "rejected"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountPapersData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the rejected tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="paperTabs"]').at(0).prop('onSelect')('rejected');
					});
					// 2. Find Rejected papers
					wrapper.update();
					let paperEntryRejected = await wrapper.find('[data-testid="paperEntryRejected"]').hostNodes();
					// 3. Assert
					expect(paperEntryRejected.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 paper showing in tab "archive"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountPapersData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the archive tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="paperTabs"]').at(0).prop('onSelect')('archive');
					});
					// 2. Find Rejected papers
					wrapper.update();
					let paperEntryArchived = await wrapper.find('[data-testid="paperEntryArchive"]').hostNodes();
					// 3. Assert
					expect(paperEntryArchived.length).toEqual(1);
					done();
				});
		});
	});
});
