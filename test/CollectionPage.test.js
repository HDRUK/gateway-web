import React from 'react'; 
import moxios from 'moxios';
import { mount } from 'enzyme';
import CollectionPage from '../src/pages/collections/CollectionPage';
import RelatedObject from '../src/pages/commonComponents/relatedObject/RelatedObject';
import { userStateData, collectionPageData } from './mocks/dataMock';
import { act } from 'react-dom/test-utils';

let wrapper; 
const match = { params: { collectionID: 5252501631473394 } };   

//Mocks useHistory()
jest.mock('react-router-dom', () => ({
	useHistory: () => ({
	  push: jest.fn(),
	}),
  }));

describe('<CollectionPage /> rendering', () => {
	beforeEach(function () {
		// import and pass your custom axios instance to this method
		moxios.install();
	});
	afterEach(function () {
		// import and pass your custom axios instance to this method
		moxios.uninstall();
	});

	it('renders with <Loading /> component', () => {
		wrapper = shallow(<CollectionPage userState={userStateData} match={match} />);
		expect(wrapper.find('[data-testid="isLoading"]').exists()).toEqual(true);
	});

	it('renders with correct collection information and 1 tool on the "Tools" tab', async done => {
		wrapper = mount( 
			<CollectionPage 
				userState={userStateData} 
				match={match} 
			/>
		);
		
		await moxios.wait(jest.fn);
		await act(async () => {
			let collectionRequest = moxios.requests.at(0); 
			collectionRequest
				.respondWith({
					status: 200,
					response: { 
						success: true,
						data: collectionPageData.data, 
					},
				})
				.then(async () => {
					setTimeout(async() => {
						wrapper.update();
						await act(async () => {
							let courseRequest = moxios.requests.at(1);
							courseRequest
							.respondWith({
								status: 200,
								response: { 
									success: true,
									data: collectionPageData.courseObjectData
								},
							})
							.then(async () => {
								await act(async () => {
									let toolRequest = moxios.requests.at(2);
									toolRequest
									.respondWith({
									status: 200,
									response: { 
										success: true,
										data: collectionPageData.toolObjectData
									},
									})
									.then(async () => {
										wrapper.update();
										expect(wrapper.find('[data-testid="collectionName"]').exists()).toEqual(true);
										expect(wrapper.find('[data-testid="collectionName"]').text().trim()).toEqual('test collection jan');
										expect(wrapper.find('[data-testid="collectionCreated"]').exists()).toEqual(true);
										expect(wrapper.find('[data-testid="collectionCreated"]').text().trim()).toEqual('Created Jan 2021');
										expect(wrapper.find('[data-testid="collectionDescription"]').exists()).toEqual(true);
										expect(wrapper.find('[data-testid="collectionDescription"]').text().trim()).toEqual('test description');
										expect(wrapper.find(RelatedObject).length).toEqual(1); 
										done();
									});
								});
							});
						});
					}, 3000);
				});
		});
	});


	it('renders 0 projects after clicking on the "Projects" tab', async done => {
		await act(async () => {
        	await wrapper.find('[data-testid="collectionPageTabs"]').at(0).prop('onSelect')('Projects');
			wrapper.update();
			expect(wrapper.find(RelatedObject).length).toEqual(0); 
        });
		done();
   });

   it('renders 1 course after clicking on the "Course" tab', async done => {
		await act(async () => {
			await wrapper.find('[data-testid="collectionPageTabs"]').at(0).prop('onSelect')('Course');
				wrapper.update();
				expect(wrapper.find(RelatedObject).length).toEqual(1); 
	    });
	 	done();
	});

	it('renders 0 papers after clicking on the "Papers" tab', async done => {
		await act(async () => {
			await wrapper.find('[data-testid="collectionPageTabs"]').at(0).prop('onSelect')('Papers');
				wrapper.update();
				expect(wrapper.find(RelatedObject).length).toEqual(0); 
	    });
	 	wrapper.unmount();
	 	done();
	});

});
