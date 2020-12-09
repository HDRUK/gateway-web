import React from 'react';
import SearchBar from '../src/pages/commonComponents/searchBar/SearchBar';
import { searchBarState } from './mocks/dataMock';
import { searchBarStateLoggedIn } from './mocks/dataMock';

let wrapper, props;

beforeEach(() => {
	props = searchBarState;
	jest.resetModules();
});

describe('<SearchBar /> rendering', () => {
	it('renders Search bar with blank value', () => {
		wrapper = shallow(<SearchBar {...props} />);
		expect(wrapper.find('[data-testid="searchbar"]').text()).toEqual('');
	});

	it('renders Search bar with `no clear button` by default', () => {
		wrapper = shallow(<SearchBar {...props} />);
		const input = wrapper.find('[data-testid="searchbar-clear-btn"]');
		expect(input.exists()).toBeFalsy();
	});

	it('renders Search bar with `clear button present` when props.searchString', () => {
		wrapper = shallow(<SearchBar {...props} />);
		wrapper.setProps({
			searchString: 'test',
		});
		wrapper.update();
		const input = wrapper.find('[data-testid="searchbar-clear-btn"]');
		expect(input.exists()).toBeTruthy();
	});
});

describe('<SearchBar /> interactions', () => {
	it('should call onChange function when user interacts', () => {
		const updateSearchString = jest.fn();
		const mockEvent = {
			target: { value: 'epilepsy' },
		};
		wrapper = shallow(<SearchBar {...props} doUpdateSearchString={updateSearchString} />);
		wrapper.find('[data-testid="searchbar"]').simulate('change', mockEvent);
		expect(wrapper.state('textValue')).toEqual('epilepsy');
	});
});

describe('<SearchBar /> when logged in', () => {
	it('should render when logged in', () => {
		wrapper = shallow(<SearchBar {...searchBarStateLoggedIn} />);
	});
});
