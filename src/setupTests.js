import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import * as rtl from '@testing-library/react';
import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime';

Enzyme.configure({
	adapter: new Adapter(),
});

global.React = React;
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.fireEvent = rtl.fireEvent;

global.assertServiceMutateAsyncCalled = async (rendered, mock, ...args) => {
	const { waitFor, result } = rendered;

	await waitFor(() => result.current.mutateAsync);

	result.current.mutateAsync(args).then(() => {
		expect(mock).toHaveBeenCalledWith(args);
	});
};

global.assertServiceRefetchCalled = async (rendered, mock, ...args) => {
	const { waitFor, result } = rendered;

	await waitFor(() => result.current.refetch);

	result.current.refetch(args).then(() => {
		expect(mock).toHaveBeenCalledWith(args);
	});
};

global.createPortalContainer = () => {
	const div = document.createElement('div');
	document.body.appendChild(div);

	return div;
};

global.removePortalContainer = div => {
	div.parentNode.removeChild(div);
};

global.assertServicePatchCalled = async () => {};
