import React from 'react';
import NotFound from '../src/pages/commonComponents/NotFound';
import { notFoundData } from './mocks/dataMock';

let wrapper, props;

beforeEach(() => {
	props = notFoundData;
});

describe('<NotFound /> rendering', () => {
	it('renders NotFound component with "No reviews found"', () => {
		wrapper = shallow(<NotFound {...props} />);
		expect(wrapper.find('[data-testid="notFound"]').text()).toEqual('No reviews found');
	});
});
