import React from 'react';
import TypeaheadAsyncCustom from './index';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { server } from '../../../../services/mockServer';

const mockIcon = jest.fn();

jest.mock('../../../../components/Icon', () => props => {
	mockIcon(props);

	return <button {...props}>Icon</button>;
});

const props = {
	value: ['United Kingdon,Cambridge', 'United States'],
};

let input;
let wrapper;

describe('Given the TypeaheadAsyncCustom component', () => {
	beforeAll(() => {
		server.listen();
	});

	afterEach(() => {
		server.resetHandlers();
	});

	afterAll(() => {
		server.close();
	});

	describe('When it is rendered without default value', () => {
		beforeAll(() => {
			wrapper = render(<TypeaheadAsyncCustom value={[]} />, {
				wrapper: Providers,
			});

			input = document.querySelector('.rbt-input-main');
		});

		it('Then should match the snapshot', () => {
			expect(wrapper.container).toMatchSnapshot();
		});

		describe('And the input is empty', () => {
			beforeAll(async () => {
				fireEvent.click(input);
				fireEvent.change(input, { target: { value: '' } });
			});

			it('Then should have no value', () => {
				expect(input.value).toBe('');
			});

			it('Then should have an icon', () => {
				expect(wrapper.queryByTestId('searchicon')).toBeNull();
			});
		});

		describe('And the input has a value', () => {
			beforeAll(() => {
				fireEvent.click(input);
				fireEvent.change(input, { target: { value: 'test' } });
			});

			it('Then should have the correct value', () => {
				expect(input.value).toBe('test');
			});

			it('Then should not have an icon', () => {
				expect(wrapper.queryByTestId('searchicon')).toBeNull();
			});

			it('Then should have the correct dropdown values', async () => {
				await waitFor(() => expect(wrapper.queryByText('United Kingdon,Colchester')).toBeTruthy());
				await waitFor(() => expect(wrapper.queryByText('Colchester')).toBeTruthy());
				await waitFor(() => expect(wrapper.queryAllByText('Ireland')).toBeTruthy());
			});
		});
	});

	describe('When it is rendered with default value', () => {
		beforeAll(() => {
			wrapper = render(<TypeaheadAsyncCustom {...props} />, {
				wrapper: Providers,
			});
		});

		it('Then search Icon should not be rendered', () => {
			expect(wrapper.queryByTestId('searchicon')).toBeNull();
		});

		it('Then default values should be rendered', () => {
			expect(screen.queryByText('Cambridge')).toBeTruthy();
			expect(screen.queryByText('United States')).toBeTruthy();
		});
	});
});
