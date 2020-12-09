import React from 'react';
import UnmetDemand from '../src/pages/dashboard/DARComponents/UnmetDemand';
import { datasetMock, toolMock, paperMock, personMock, projectMock } from './mocks/unmetDemandMock';

describe('<UnmetDemand /> rendering', () => {
	it('renders dataset without crashing', () => {
		const wrapper = shallow(<UnmetDemand data={datasetMock} />);
	});
});

describe('<UnmetDemand /> rendering', () => {
	it('renders tool without crashing', () => {
		const wrapper = shallow(<UnmetDemand data={toolMock} />);
	});
});

describe('<UnmetDemand /> rendering', () => {
	it('renders paper without crashing', () => {
		const wrapper = shallow(<UnmetDemand data={paperMock} />);
	});
});

describe('<UnmetDemand /> rendering', () => {
	it('renders person without crashing', () => {
		const wrapper = shallow(<UnmetDemand data={personMock} />);
	});
});

describe('<UnmetDemand /> rendering', () => {
	it('renders project without crashing', () => {
		const wrapper = shallow(<UnmetDemand data={projectMock} />);
	});
});

describe('Simulate a click', () => {
	it('opens and closes accordion', () => {
		const wrapper = shallow(<UnmetDemand data={projectMock} />);
		const accordion = wrapper.find('[data-testid="accordion-toggle"]');

		expect(accordion.simulate('click'));
		let a = wrapper.state('flagClosed');
		expect(wrapper.state('flagClosed')).toEqual(false);

		expect(accordion.simulate('click'));
		a = wrapper.state('flagClosed');
		expect(wrapper.state('flagClosed')).toEqual(true);
	});
});
