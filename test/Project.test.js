import React from 'react';
import Project from '../src/pages/commonComponents/Project';
import { projectData } from './mocks/dataMock';

describe('<Project /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<Project data={projectData} />);
	});
});
