import { fireEvent, render, screen } from 'testUtils';
import React from 'react';
import Modal from './Modal';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';

const props = {
    open: true,
    onClose: jest.fn(),
};

let wrapper;

describe('Given the Modal component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(
                <Modal {...props}>
                    <ModalHeader>Header</ModalHeader>
                    <ModalBody>Body</ModalBody>
                    <ModalFooter>Footer</ModalFooter>
                </Modal>
            );
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then contains the correct content', async () => {
            expect(wrapper.getByText('Header')).toBeTruthy();
            expect(wrapper.getByText('Body')).toBeTruthy();
            expect(wrapper.getByText('Footer')).toBeTruthy();
        });

        describe('When it is closed', () => {
            beforeAll(() => {
                const button = screen.getByRole('button');

                fireEvent.click(button);
            });

            it('Then contains the correct content', async () => {
                expect(wrapper.container.innerHTML).toEqual('');
            });
        });

        describe('When it is not open', () => {
            beforeAll(() => {
                wrapper = render(
                    <Modal open={false}>
                        <ModalHeader>Header</ModalHeader>
                        <ModalBody>Body</ModalBody>
                        <ModalFooter>Footer</ModalFooter>
                    </Modal>
                );
            });

            it('Then contains the correct content', async () => {
                expect(wrapper.container.innerHTML).toEqual('');
            });
        });
    });
});
