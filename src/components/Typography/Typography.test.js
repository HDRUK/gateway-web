import React from 'react';
import { render } from '@testing-library/react';
import Typography from '.';

let wrapper;

describe('Given the Typography component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Typography>Content</Typography>, {
                wrapper: Providers,
            });
        });

        it('Then has the correct tag', () => {
            expect(wrapper.getByText('Content')).toBeTruthy();
        });

        it('Then has the correct content', () => {
            expect(wrapper.container.querySelector('p')).toBeTruthy();
        });

        describe('And it is a h1', () => {
            it('Then should contain the correct tag', () => {
                wrapper.rerender(<Typography variant='h1'>Content</Typography>);
                expect(wrapper.container.querySelector('h1')).toBeTruthy();
            });
        });

        describe('And it is a h2', () => {
            it('Then should contain the correct tag', () => {
                wrapper.rerender(<Typography variant='h2'>Content</Typography>);
                expect(wrapper.container.querySelector('h2')).toBeTruthy();
            });
        });

        describe('And it is a h3', () => {
            it('Then should contain the correct tag', () => {
                wrapper.rerender(<Typography variant='h3'>Content</Typography>);
                expect(wrapper.container.querySelector('h3')).toBeTruthy();
            });
        });

        describe('And it is a h4', () => {
            it('Then should contain the correct tag', () => {
                wrapper.rerender(<Typography variant='h4'>Content</Typography>);
                expect(wrapper.container.querySelector('h4')).toBeTruthy();
            });
        });

        describe('And it is a h5', () => {
            it('Then should contain the correct tag', () => {
                wrapper.rerender(<Typography variant='h5'>Content</Typography>);
                expect(wrapper.container.querySelector('h5')).toBeTruthy();
            });
        });

        describe('And it is a h6', () => {
            it('Then should contain the correct tag', () => {
                wrapper.rerender(<Typography variant='h6'>Content</Typography>);
                expect(wrapper.container.querySelector('h6')).toBeTruthy();
            });
        });

        describe('And it is a caption', () => {
            it('Then should contain the correct tag', () => {
                wrapper.rerender(<Typography variant='caption'>Content</Typography>);
                expect(wrapper.container.querySelector('span')).toBeTruthy();
            });
        });

        describe('And it is tiny', () => {
            it('Then should contain the correct tag', () => {
                wrapper.rerender(<Typography variant='tiny'>Content</Typography>);
                expect(wrapper.container.querySelector('span')).toBeTruthy();
            });
        });
    });
});
