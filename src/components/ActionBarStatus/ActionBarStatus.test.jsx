import React from 'react';
import { render } from '@testing-library/react';
import ActionBarStatus from '.';

let wrapper;

const props = {
    dataset: {
        timestamps: {
            published: '2021-09-28',
            submitted: '2021-09-22',
            rejected: '2021-09-23',
            archived: '2021-09-29',
        },
    },
    status: 'active',
    totalQuestions: '1 / 45 questions answered',
    className: 'additional-className',
};

describe('Given the ActionBarStatus component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<ActionBarStatus {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            expect(wrapper.container.firstChild.classList.contains('additional-className')).toBeTruthy();
        });

        describe('And the status is active', () => {
            it('Then has the correct output', () => {
                expect(wrapper.container.textContent).toBe('This version was published on 28 September 2021');
            });
        });

        describe('And the status is draft', () => {
            it('Then has the correct output', () => {
                const { rerender, container } = wrapper;

                rerender(<ActionBarStatus {...props} status='draft' />);

                expect(container.textContent).toBe('1 / 45 questions answered');
            });
        });

        describe('And the status is published', () => {
            it('Then has the correct output', () => {
                const { rerender, container } = wrapper;

                rerender(<ActionBarStatus {...props} status='inReview' />);

                expect(container.textContent).toBe('Submitted for review on 22 September 2021');
            });
        });

        describe('And the status is rejected', () => {
            it('Then has the correct output', () => {
                const { rerender, container } = wrapper;

                rerender(<ActionBarStatus {...props} status='rejected' />);

                expect(container.textContent).toBe('This version was rejected on 23 September 2021');
            });
        });

        describe('And the status is archived', () => {
            it('Then has the correct output', () => {
                const { rerender, container } = wrapper;

                rerender(<ActionBarStatus {...props} status='archived' />);

                expect(container.textContent).toBe('This version was published on 28 September 2021 and archived on 29 September 2021');
            });
        });

        describe('And there is no status', () => {
            it('Then has no output', () => {
                const { rerender, container } = wrapper;

                rerender(<ActionBarStatus {...props} status={null} />);

                expect(container.textContent).toBe('');
            });
        });
    });
});
