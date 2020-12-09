import React from 'react';

import SVGIcon from '../src/images/SVGIcon';

describe('<SVGIcon /> rendering', () => {
	it('renders all icons without crashing', () => {
		[
			'dataseticon',
			'projecticon',
			'newnotificationicon',
			'searchicon',
			'toolicon',
			'emptystar',
			'clear',
			'stock',
			'default',
			'newprojecticon',
			'newtoolicon',
			'accounticon',
			'dataaccessicon',
			'rolesicon',
			'bell',
			'newestprojecticon',
			'personicon',
			'closeicon',
			'reviewsicon',
		].forEach(icon => {
			const wrapper = shallow(<SVGIcon name={icon} width={18} height={18} fill={'#3db28c'} />);
		});
	});

	it('renders with minimum params', () => {
		const wrapper = shallow(<SVGIcon />);
	});
});
