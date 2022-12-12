import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Description from './Description';

const props = {
    description: 'This is a test description',
    type: 'test',
};
let wrapper;

describe('Given the Description component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Description {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then description should be rendered', () => {
            expect(screen.getByTestId(`${props.type}-description`)).toHaveTextContent(props.description);
        });
    });
});
