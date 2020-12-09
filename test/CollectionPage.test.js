import React from 'react';
import CollectionPage from '../src/pages/collections/CollectionPage';
import RelatedObject from '../src/pages/commonComponents/relatedObject/RelatedObject';
import { userStateData, collectionPageData } from './mocks/dataMock';

let wrapper;
const match = { params: { collectionID: 5506469491028065 } };

describe('<CollectionPage /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(<CollectionPage userState={userStateData} match={match} />);
	});

	it('renders with <Loading /> component', () => {
		wrapper = shallow(<CollectionPage userState={userStateData} match={match} />);
		expect(wrapper.find('[data-testid="isLoading"]').exists()).toEqual(true);
	});

	it('renders 4 <RelatedObject /> components in tab "All"', () => {
		wrapper = shallow(<CollectionPage userState={userStateData} match={match} />);
		wrapper.setState({ isLoading: false, key: 'All', data: collectionPageData.data, objectData: collectionPageData.objectData });
		expect(wrapper.find(RelatedObject).length).toBe(4);
	});

	it('renders 1 <RelatedObject /> component in tab "Datasets"', () => {
		wrapper = shallow(<CollectionPage userState={userStateData} match={match} />);
		wrapper.setState({ isLoading: false, key: 'Datasets', data: collectionPageData.data, objectData: collectionPageData.objectData });
		expect(wrapper.find(RelatedObject).length).toBe(1);
	});

	it('renders 2 <RelatedObject /> components in tab "Tools"', () => {
		wrapper = shallow(<CollectionPage userState={userStateData} match={match} />);
		wrapper.setState({ isLoading: false, key: 'Tools', data: collectionPageData.data, objectData: collectionPageData.objectData });
		expect(wrapper.find(RelatedObject).length).toBe(2);
	});

	it('renders 1 <RelatedObject /> component in tab "Projects"', () => {
		wrapper = shallow(<CollectionPage userState={userStateData} match={match} />);
		wrapper.setState({ isLoading: false, key: 'Projects', data: collectionPageData.data, objectData: collectionPageData.objectData });
		expect(wrapper.find(RelatedObject).length).toBe(1);
	});

	it('does not render any <RelatedObject /> components in tab "Papers"', () => {
		wrapper = shallow(<CollectionPage userState={userStateData} match={match} />);
		wrapper.setState({ isLoading: false, key: 'Papers', data: collectionPageData.data, objectData: collectionPageData.objectData });
		expect(wrapper.find(RelatedObject).length).toBe(0);
	});

	it('does not render any <RelatedObject /> components in tab "People"', () => {
		wrapper = shallow(<CollectionPage userState={userStateData} match={match} />);
		wrapper.setState({ isLoading: false, key: 'People', data: collectionPageData.data, objectData: collectionPageData.objectData });
		expect(wrapper.find(RelatedObject).length).toBe(0);
	});
});
