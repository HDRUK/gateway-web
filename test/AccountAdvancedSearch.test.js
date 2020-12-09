import React from 'react';
import AccountAdvancedSearch from '../src/pages/dashboard/AccountAdvancedSearch';
import { userStateData } from './mocks/dataMock';
import { Card } from 'react-bootstrap';

let wrapper;

describe('<AccountAdvancedSearch /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(<AccountAdvancedSearch UserState={userStateData} />);
	});

	it('renders 2 <Card /> components', () => {
		wrapper = shallow(<AccountAdvancedSearch UserState={userStateData} />);
		expect(wrapper.find(Card).length).toBe(2);
	});
});
