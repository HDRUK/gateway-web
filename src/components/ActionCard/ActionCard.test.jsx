import { render, screen } from 'testUtils';
import React from 'react';
import ActionCard from './ActionCard';

const props = {
    title: 'Title',
    content: 'Content',
    actions: 'Action',
};

let wrapper;

describe('Given the ActionCard component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<ActionCard {...props} />);
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct title', () => {
            expect(screen.getByText(/Title/)).toBeTruthy();
        });

        it('Then has the correct content', () => {
            expect(screen.getByText(/Content/)).toBeTruthy();
        });

        it('Then has the correct action', () => {
            expect(screen.getByText(/Action/)).toBeTruthy();
        });
    });
});
