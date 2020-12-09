import React from 'react';
import NotFound from '../src/pages/commonComponents/NotFound';
import { notFoundData } from './mocks/dataMock';

describe('<NotFound /> rendering for Search', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<NotFound data={notFoundData} />);
	});
});
