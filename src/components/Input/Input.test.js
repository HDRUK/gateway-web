import { render, waitFor } from '@testing-library/react';
import React from 'react';
import Input from '.';
import Icon from '../Icon';

jest.mock('lodash/debounce', () => fn => {
	fn();
});

const props = {
	iconPrepend: <Icon name='loading' inline />,
	textPrepend: 'Prepend text',
	iconAppend: <Icon name='tick' inline />,
	textAppend: 'Append text',
	value: 'collection',
	onDebounce: jest.fn(),
	onChange: jest.fn(),
	label: 'Sample label',
};

let wrapper;

describe('Given the Input component', () => {
	describe('When it is rendered', () => {
		beforeAll(() => {
			wrapper = render(<Input {...props} />, {
				wrapper: Providers,
			});
		});

		it('Then matches the previous snapshot', () => {
			expect(wrapper.container).toMatchSnapshot();
		});

		it('Then has a label', () => {
			expect(wrapper.getByText('Sample label')).toBeTruthy();
		});

		it('Then has the prepended content', () => {
			expect(wrapper.container.querySelector('.input-group-prepend .input-group-text').textContent).toEqual('Prepend text');
			expect(wrapper.container.querySelector('.input-group-prepend .ui-Icon')).toBeTruthy();
		});

		it('Then has the appended content', () => {
			expect(wrapper.container.querySelector('.input-group-append .input-group-text').textContent).toEqual('Append text');
			expect(wrapper.container.querySelector('.input-group-append .ui-Icon')).toBeTruthy();
		});

		it('Then has the correct value', () => {
			expect(wrapper.container.querySelector('input').value).toEqual('collection');
		});

		describe('And the input is changed', () => {
			beforeAll(() => {
				const input = wrapper.container.querySelector('input');

				fireEvent.change(input, { target: { value: 'dataset' } });
			});

			it('Then has called change', async () => {
				await waitFor(() => expect(props.onChange).toHaveBeenCalled());
			});

			it('Then has called debounce', async () => {
				await waitFor(() => expect(props.onDebounce).toHaveBeenCalled());
			});
		});
	});
});
