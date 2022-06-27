import { render, waitFor } from '@testing-library/react';
import React from 'react';
import Alert from './Alert';

const props = {
    onClose: jest.fn(),
    variant: 'success',
};

let wrapper;

describe('Given the Alert component', () => {
    describe('When it is rendered', () => {
        beforeEach(() => {
            wrapper = render(<Alert {...props}>Content</Alert>, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        describe('And it is dismissable', () => {
            beforeEach(() => {
                wrapper = render(
                    <Alert {...props} dismissable>
                        Content
                    </Alert>,
                    {
                        wrapper: Providers,
                    }
                );
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            describe('And it is closed', () => {
                beforeEach(() => {
                    const close = wrapper.container.querySelector('[role="button"]');

                    fireEvent.click(close);
                });

                it('Then does not show anything', async () => {
                    await waitFor(() => {
                        expect(wrapper.container.querySelector('.ui-LayoutBox')).toBeNull();
                    });
                });

                it('Then calls onClose', () => {
                    expect(props.onClose).toHaveBeenCalled();
                });
            });
        });

        describe('And autoclose is set', () => {
            beforeEach(() => {
                wrapper = render(
                    <Alert {...props} autoclose autocloseDuration={1000}>
                        Content
                    </Alert>,
                    {
                        wrapper: Providers,
                    }
                );
            });

            afterAll(() => {
                jest.clearAllMocks();
            });

            it('Then does not show anything', async () => {
                await waitFor(() => {
                    expect(wrapper.container.querySelector('.ui-LayoutBox')).toBeNull();
                });
            });

            it('Then calls onClose', () => {
                expect(props.onClose).toHaveBeenCalled();
            });
        });

        describe('And it has an icon specified', () => {
            it('Then does not show other icons', () => {
                wrapper.rerender(
                    <Alert {...props} icon='Icon'>
                        Content
                    </Alert>
                );

                expect(wrapper.container.querySelector('.ui-Alert__icon').innerHTML).toEqual('Icon');
            });
        });
    });
});
