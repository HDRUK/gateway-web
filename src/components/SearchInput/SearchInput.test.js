import { render } from '@testing-library/react';
import React from 'react';
import SearchInput from '.';

jest.mock('../Icon', () => {
    return props => <button {...props}>Icon</button>;
});

const props = {
    value: '',
    onReset: jest.fn(),
    onSubmit: jest.fn(),
};

let wrapper;

describe('Given the SearchInput component', () => {
    describe('When it is rendered', () => {
        beforeEach(() => {
            wrapper = render(<SearchInput {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has a search icon', () => {
            expect(wrapper.container.querySelector('[name="search"]')).toBeTruthy();
        });

        it('Then does not have a reset icon', () => {
            expect(wrapper.container.querySelector('[name="clear"]')).toBeFalsy();
        });

        describe('And it is reset', () => {
            beforeAll(() => {
                wrapper = render(<SearchInput {...props} value='collection' />, {
                    wrapper: Providers,
                });

                const reset = wrapper.container.querySelector('[name="clear"]');

                fireEvent.click(reset);
            });

            it('Then calls onReset', () => {
                expect(props.onReset).toHaveBeenCalled();
            });
        });
    });
});
