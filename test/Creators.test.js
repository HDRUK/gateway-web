import React from 'react';
import Creators from '../src/pages/commonComponents/Creators.js';
import { creatorsData } from './mocks/dataMock';
let wrapper;
describe('<Creators /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(<Creators author={creatorsData} />);
	});

	it('will render with "Michael Sperling"', () => {
		wrapper = shallow(<Creators author={creatorsData} />);
		expect(wrapper.find('[data-testid="name"]').text().trim()).toEqual('Michael Sperling');
	});

	it('will render with "Jefferson Comprehensive Epilepsy Center, Philadelphia"', () => {
		wrapper = shallow(<Creators author={creatorsData} />);
		expect(wrapper.find('[data-testid="bio"]').text().trim()).toEqual('Jefferson Comprehensive Epilepsy Center, Philadelphia');
	});

	it('will contain correct href link', () => {
		wrapper = shallow(<Creators author={creatorsData} />);
		expect(wrapper.find('[data-testid="href"]').props().href).toEqual('/person/900000014');
	});
});
