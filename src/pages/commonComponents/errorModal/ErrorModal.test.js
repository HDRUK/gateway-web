import { render } from '@testing-library/react';
import React from 'react';
import ErrorModal from '.';

const onClose = jest.fn();

const props = {
    onClose,
};

let wrapper;
let containerDiv;
let closeButton;

describe('Given the ErrorModal component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            containerDiv = createPortalContainer();

            wrapper = render(<ErrorModal {...props} container={containerDiv} />);
        });

        afterAll(() => {
            removePortalContainer(containerDiv);
        });

        it('Then matches the previous snapshot', () => {
            expect(containerDiv).toMatchSnapshot();
        });

        it('Then has the correct header', () => {
            expect(wrapper.getByTestId('modal-header').textContent).toBe('Oops! Something went wrong!');
        });

        it('Then has the correct body', () => {
            expect(wrapper.getByTestId('modal-body').textContent).toBe(
                'This issue has been automatically reported to our team!If this issue continues, please contact support by clicking here.'
            );
        });

        it('Then has the correct footer', () => {
            expect(wrapper.getByTestId('modal-footer').textContent).toBe('Close');
        });

        describe('And the modal is closed', () => {
            beforeEach(() => {
                closeButton = wrapper.getByTestId('close-button');

                fireEvent.click(closeButton);
            });

            afterAll(() => {
                onClose.mockReset();
            });

            it('Then hides the modal', () => {
                expect(wrapper.container.querySelector('.show')).toBeNull();
            });

            it('Then calls onClose', () => {
                expect(onClose).toHaveBeenCalled();
            });

            it('Then hides the modal', () => {
                expect(location.pathname).toEqual('/');
            });
        });
    });

    describe('And the modal is closed without onClose', () => {
        beforeAll(() => {
            containerDiv = createPortalContainer();

            wrapper = render(<ErrorModal container={containerDiv} />);

            closeButton = wrapper.getByTestId('close-button');
            fireEvent.click(closeButton);
        });

        afterAll(() => {
            removePortalContainer(containerDiv);
        });

        it('Then doesnt call onClose', () => {
            expect(onClose).toHaveBeenCalledTimes(0);
        });
    });
});
