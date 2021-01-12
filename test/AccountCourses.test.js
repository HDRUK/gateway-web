import AccountCourses from '../src/pages/dashboard/AccountCourses';
import { accountCoursesData } from './mocks/dataMock';
import { userStateData } from './mocks/dataMock';
import moxios from 'moxios';
import { act } from 'react-dom/test-utils';

let wrapper;
describe('<AccountCourses />', () => {
	beforeEach(function () {
		moxios.install();
		wrapper = mount(<AccountCourses userState={userStateData.userState} />);
	});

	afterEach(function () {
		moxios.uninstall();
		wrapper.unmount();
	});

	it('renders with 1 course showing in tab "active"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountCoursesData.data },
				})
				.then(async () => {
					wrapper.update();
					let courseEntryActive = await wrapper.find('[data-testid="courseEntryActive"]').hostNodes();
					expect(courseEntryActive.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 course showing in tab "pending"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountCoursesData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the archive tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="courseTabs"]').at(0).prop('onSelect')('pending');
					});
					// 2. Find Pending Courses
					wrapper.update();
					let courseEntryPending = await wrapper.find('[data-testid="courseEntryPending"]').hostNodes();
					//3. Assert
					expect(courseEntryPending.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 course showing in tab "rejected"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountCoursesData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the rejected tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="courseTabs"]').at(0).prop('onSelect')('rejected');
					});
					// 2. Find Rejected courses
					wrapper.update();
					let courseEntryRejected = await wrapper.find('[data-testid="courseEntryRejected"]').hostNodes();
					// 3. Assert
					expect(courseEntryRejected.length).toEqual(1);
					done();
				});
		});
	});

	it('renders with 1 course showing in tab "archive"', async done => {
		await moxios.wait(jest.fn);
		await act(async () => {
			let request = moxios.requests.mostRecent();
			request
				.respondWith({
					status: 200,
					response: { data: accountCoursesData.data },
				})
				.then(async () => {
					// 1. Simulate a click on the archive tab
					wrapper.update();
					await act(async () => {
						await wrapper.find('[data-testid="courseTabs"]').at(0).prop('onSelect')('archive');
					});
					// 2. Find Rejected courses
					wrapper.update();
					let courseEntryArchived = await wrapper.find('[data-testid="courseEntryArchive"]').hostNodes();
					// 3. Assert
					expect(courseEntryArchived.length).toEqual(1);
					done();
				});
		});
	});
});
