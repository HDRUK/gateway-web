import AccountCollections from '../src/pages/dashboard/AccountCollections';
import { accountCollectionsData } from './mocks/dataMock';
import { userStateData } from './mocks/dataMock';
import moxios from 'moxios';
import { act } from 'react-dom/test-utils';

let wrapper;

describe('<AccountCollections />', () => {
	beforeEach(function () {
		moxios.install();
		wrapper = mount(<AccountCollections userState={userStateData.userState} />);
	});

	afterEach(function () {
		moxios.uninstall();
		wrapper.unmount();
	});

	it('renders with 5 collections showing in tab "active"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountCollectionsData.data },
				})
				.then(async () => {
					wrapper.update();
					let collectionEntryActive = await wrapper.find('[data-testid="collectionEntryActive"]').hostNodes();
					expect(collectionEntryActive.length).toEqual(5);
					done();
				});
		});
	});

	it('renders collectionEntry not found', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: [] },
				})
				.then(async () => {
					wrapper.update();
					let collectionEntryNotFound = await wrapper.find('[data-testid="collectionEntryNotFound"]').hostNodes();
					expect(collectionEntryNotFound.exists()).toEqual(true);
					done();
				});
		});
	});

	it('renders with 2 collections showing in tab "archive"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountCollectionsData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the archive tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="collectionTabs"]').at(0).prop('onSelect')('archive');
					});
					// 2. Find Archived collections
					await wrapper.update();
					let collectionEntryArchive = await wrapper.find('[data-testid="collectionEntryArchive"]').hostNodes();
					// 3. Assert
					expect(collectionEntryArchive.length).toEqual(2);
					done();
				});
		});
	});
});
