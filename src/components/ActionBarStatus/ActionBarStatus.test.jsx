import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe.skip('Given the ActionBarStatus component', () => {
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
                expect(screen.getByText('This version was published on 28 September 2021')).toBeInTheDocument();
            });
        });

        describe('And the status is draft', () => {
            it('Then has the correct output', () => {
                render(<ActionBarStatus {...props} status='draft' />);

                expect(screen.getByText('1 / 45 questions answered')).toBeInTheDocument();
            });
        });

        describe('And the status is published', () => {
            it('Then has the correct output', () => {
                render(<ActionBarStatus {...props} status='inReview' />);

                expect(screen.getByText('Submitted for review on 22 September 2021')).toBeInTheDocument();
            });
        });

        describe('And the status is rejected', () => {
            it('Then has the correct output', () => {
                render(<ActionBarStatus {...props} status='rejected' />);

                expect(screen.getByText('This version was rejected on 23 September 2021')).toBeInTheDocument();
            });
        });

        describe('And the status is archived', () => {
            it('Then has the correct output', () => {
                render(<ActionBarStatus {...props} status='archived' />);

                expect(
                    screen.getByText('This version was published on 28 September 2021 and archived on 29 September 2021')
                ).toBeInTheDocument();
            });
        });

        describe('And there is no status', () => {
            it('Then has no output', () => {
                const { container } = render(<ActionBarStatus {...props} status={null} />);

                expect(container.textContent).toBe('');
            });
        });
    });
});
