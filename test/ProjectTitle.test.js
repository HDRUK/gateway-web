import React from 'react';
import ProjectTitle from '../src/pages/project/components/ProjectTitle';
import { projectTitleData } from './mocks/dataMock';

describe('<ProjectTitle /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<ProjectTitle data={projectTitleData} />);
	});
});
