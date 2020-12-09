import React from 'react';
import PersonTitle from '../src/pages/person/components/PersonTitle';
import { personTitleData } from './mocks/dataMock';

describe('<PersonTitle /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<PersonTitle data={personTitleData} />);
	});
});
