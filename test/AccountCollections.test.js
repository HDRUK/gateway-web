import AccountCollections from '../src/pages/dashboard/AccountCollections';
import { accountCollectionsData } from './mocks/dataMock';
import { userStateData } from './mocks/dataMock';

let wrapper;

describe('<AccountCollections /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(<AccountCollections userState={userStateData.userState} />);
	});

	it('renders with <Loading /> component', () => {
		wrapper = shallow(<AccountCollections userState={userStateData.userState} />);
		expect(wrapper.find('[data-testid="isLoading"]').exists()).toEqual(true);
	});

	it('renders with 5 collections showing in tab "active"', () => {
		wrapper = shallow(<AccountCollections userState={userStateData.userState} />);
		wrapper.setState({ isLoading: false, key: 'active', data: accountCollectionsData.data });
		expect(wrapper.find('[data-testid="collectionEntry"]').length).toBe(5);
	});

	it('renders with 5 collections showing in tab "archive"', () => {
		wrapper = shallow(<AccountCollections userState={userStateData.userState} />);
		wrapper.setState({ isLoading: false, key: 'archive', data: accountCollectionsData.data });
		expect(wrapper.find('[data-testid="collectionEntry"]').length).toBe(2);
	});
});
