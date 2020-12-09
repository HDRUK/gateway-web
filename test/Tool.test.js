import React from 'react';
import Tool from '../src/pages/commonComponents/Tool';
import { toolData } from './mocks/dataMock';

describe('<Tool /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<Tool data={toolData} />);
	});
});
