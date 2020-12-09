import React from 'react';
import AccountDatasets from '../src/pages/dashboard/AccountDatasets';
import { userStateData } from './mocks/dataMock';
import { Card } from 'react-bootstrap';

let wrapper;

describe('<AccountDatasets /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(<AccountDatasets UserState={userStateData} />);
	});

	it('renders 3 <Card /> components', () => {
		wrapper = shallow(<AccountDatasets UserState={userStateData} />);
		expect(wrapper.find(Card).length).toBe(3);
	});

	it('allows a click', () => {
		wrapper = shallow(<AccountDatasets UserState={userStateData} />);
		const button = wrapper.find('[data-testid="servicedesk-button"]');
		expect(button.simulate('click'));
	});

	it('allows a click', () => {
		wrapper = shallow(<AccountDatasets UserState={userStateData} />);
		const button = wrapper.find('[data-testid="userguide-button"]');
		expect(button.simulate('click'));
	});
});
