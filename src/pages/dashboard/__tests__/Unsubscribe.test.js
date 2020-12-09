import React from 'react';
import Unsubscribe from '../Unsubscribe';
import { unsubscribeState } from '../../../../test/mocks/dataMock';

let wrapper, props;

beforeEach(() => {
	props = unsubscribeState;
});

describe('<Unsubscribe /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(<Unsubscribe {...props} />);
	});

	it('renders alert variant message if unsubscribe fails', () => {
		wrapper = shallow(<Unsubscribe {...props} />);
		wrapper.setState({
			error: true,
		});
		const alertProps = wrapper.find('Alert').props();
		expect(alertProps.variant).toBe('danger');
	});

	it('renders success variant message if unsunbscribe succeeds', () => {
		wrapper = shallow(<Unsubscribe {...props} />);
		wrapper.setState({
			error: false,
		});
		const alertProps = wrapper.find('Alert').props();
		expect(alertProps.variant).toBe('success');
	});

	it('renders a default failure message if the unsubscribe link is erroneous', () => {
		props.match.params.userObjectID = '';
		wrapper = shallow(<Unsubscribe {...props} />);
		const alertProps = wrapper.find('Alert').props();
		expect(alertProps.children).toBe('A problem occurred unsubscribing from email notifications.');
		expect(alertProps.variant).toBe('danger');
	});

	it('should check `componentDidMount()`', () => {
		props.match.params.userObjectID = 1;
		wrapper = shallow(<Unsubscribe {...props} />);
		const instance = wrapper.instance();
		jest.spyOn(instance, 'unsubscribeUser');
		instance.componentDidMount();
		expect(instance.unsubscribeUser).toHaveBeenCalledTimes(1);
	});
});
