import { render } from '@testing-library/react';
import React from 'react';
import AlertModal from '.';

let wrapper;

const props = {
    show: true,
    header: 'This is the header',
    body: 'This is the body',
    footer: 'This is the footer',
};

let containerDiv;

describe('Given the AlertModal component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            containerDiv = createPortalContainer();

            wrapper = render(<AlertModal {...props} container={containerDiv} />);
        });

        afterAll(() => {
            removePortalContainer(containerDiv);
        });

        it('Then matches the previous snapshot', () => {
            expect(containerDiv).toMatchSnapshot();
        });

        it('Then has the correct header', () => {
            expect(wrapper.getByTestId('modal-header').textContent).toBe('This is the header');
        });

        it('Then has the correct body', () => {
            expect(wrapper.getByTestId('modal-body').textContent).toBe('This is the body');
        });

        it('Then has the correct footer', () => {
            expect(wrapper.getByTestId('modal-footer').textContent).toBe('This is the footer');
        });

        describe('And the modal is hidden', () => {
            it('Then has the correct output', () => {
                wrapper.rerender(<AlertModal {...props} show={false} />);

                expect(wrapper.container.querySelector('.modal')).toBeNull();
            });
        });
    });
});
