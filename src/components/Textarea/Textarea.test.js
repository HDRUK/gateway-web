import { render, waitFor } from '@testing-library/react';
import React from 'react';
import Textarea from '.';

const mockResize = jest.fn();

jest.mock('react-textarea-autosize', () => props => {
    mockResize(props);
    return null;
});

const props = {
    label: 'Sample label',
    value: 'Lorem ipsum',
    maxCharCount: 255,
    charCountDescription: 'sample description',
    onChange: jest.fn(),
};

let wrapper;

describe('Given the Textarea component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Textarea {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then should use a standard textarea', () => {
            expect(mockResize).not.toHaveBeenCalled();
        });

        it('Then has a label with a count', () => {
            expect(wrapper.container.querySelector('.ui-TextArea__charCount').textContent).toEqual('11 sample description (11/255)');
        });

        describe('And it is set to not show char count', () => {
            it('Then autosize with the correct arguments', () => {
                wrapper.rerender(<Textarea {...props} charCountLength={0} />, {
                    wrapper: Providers,
                });

                expect(wrapper.container.querySelector('.form-label').textContent).toEqual('Sample label');
            });
        });

        describe('And it is set to autosize', () => {
            it('Then calls autosize with the correct arguments', () => {
                wrapper.rerender(<Textarea {...props} autosize />, {
                    wrapper: Providers,
                });

                expect(mockResize.mock.calls[0][0]).toMatchObject({ type: 'text', value: 'Lorem ipsum', onChange: expect.any(Function) });
            });
        });
    });
});
