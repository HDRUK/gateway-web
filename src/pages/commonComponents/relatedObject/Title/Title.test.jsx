import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Title from './Title';

const props = {
	name: 'This is a test description',
	id: '123',
	type: 'test',
};
let wrapper;

describe('Given the Title component', () => {
	describe('When it is rendered', () => {
		beforeAll(() => {
			wrapper = render(<Title {...props} />);
		});

		it('Then matches the previous snapshot', () => {
			expect(wrapper.container).toMatchSnapshot();
		});

		it('Then description should be rendered', () => {
			expect(screen.getByTestId(`${props.type}-title`)).toHaveTextContent(props.name);
		});
	});
	describe('When activeLink is true', () => {
		it('Then Title should be clickable', () => {
			const { rerender } = wrapper;
			rerender(<Title {...props} activeLink={true} />);
			expect(screen.getByTestId(`${props.type}-title`)).toHaveAttribute('href', `/${props.type}/${props.id}`);
		});
	});
});
