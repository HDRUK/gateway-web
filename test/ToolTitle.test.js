import React from 'react';
import ToolTitle from '../src/pages/tool/components/ToolTitle';
import { toolTitle, toolReview } from './mocks/dataMock';

let wrapper;

beforeEach(() => {
	wrapper = shallow(<ToolTitle data={toolTitle} reviewData={toolReview} />);
});

describe('<ToolTitle /> Rendering', () => {
	it('should render a title with `Epilepsy data research`', () => {
		expect(wrapper.find('[data-testid="title"]').text()).toEqual('Epilepsy data research');
	});
});
