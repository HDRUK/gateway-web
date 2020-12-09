import React from 'react';
import PaperPage from '../src/pages/paper/PaperPage';
import { preprintData, paperData } from './mocks/dataMock';

let wrapper, props;

beforeEach(() => {
	props = preprintData.props;
});

describe('<PaperPage /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(<PaperPage {...props} data={preprintData.data} />);
	});

	it('renders with <Loading /> component', () => {
		wrapper = shallow(<PaperPage {...props} data={preprintData.data} />);
		expect(wrapper.find('[data-testid="isLoading"]').exists()).toEqual(true);
	});

	it('will render with the preprint alert', () => {
		wrapper = shallow(<PaperPage {...props} />);
		wrapper.setState({ isLoading: false, data: preprintData.data });
		expect(wrapper.find('[data-testid="preprintAlert"]').exists()).toEqual(true);
	});

	it('will render without a preprint alert', () => {
		wrapper = shallow(<PaperPage {...props} />);
		wrapper.setState({ isLoading: false, data: paperData.data });
		expect(wrapper.find('[data-testid="preprintAlert"]').exists()).toEqual(false);
	});
});
