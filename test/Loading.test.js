import React from 'react';
import Loading from '../src/pages/commonComponents/Loading';

describe('<Loading /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<Loading />);
	});
});
