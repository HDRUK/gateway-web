import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import AsyncTypeAheadUsers from './AsyncTypeAheadUsers';
import { server } from '../../../services/mockServer';
import '@testing-library/jest-dom/extend-expect';
const mockAuthors = [
    { id: 123, name: 'Jack Reacher' },
    { id: 124, name: 'Tom Cruise' },
];
let wrapper;
let input;
const handler = jest.fn();

describe('Given the AsyncTypeAheadUsers component', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    describe('When it is rendered', () => {
        beforeAll(() => {
            server.listen();
            wrapper = render(
                <AsyncTypeAheadUsers selectedUsers={mockAuthors} showAuthor={true} currentUserId={123} changeHandler={handler} />,
                {
                    wrapper: Providers,
                }
            );
            input = document.querySelector('.rbt-input-main');
            fireEvent.click(input);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then default values should be set', () => {
            expect(wrapper.getByText('Jack Reacher')).toBeTruthy();
            expect(wrapper.getByText('Tom Cruise')).toBeTruthy();
        });

        it('Then name should be rendered for 2 contributors', async () => {
            await waitFor(() => {
                expect(wrapper.getByText('Test1 Test1')).toBeTruthy();
                expect(wrapper.getByText('Test2 Test2')).toBeTruthy();
            });
        });

        it('It should have icon next to the current user ', async () => {
            await waitFor(() => {
                expect(wrapper.getByTestId('icon-0')).toBeTruthy();
            });
        });

        it('Then it should  have `Recently added` Header', async () => {
            await waitFor(() => expect(wrapper.getByText('Recently added:')).toBeTruthy());
        });
    });
    describe('And the input has a value', () => {
        beforeAll(() => {
            server.listen();
            wrapper = render(
                <AsyncTypeAheadUsers selectedUsers={mockAuthors} showAuthor={true} currentUserId={123} changeHandler={handler} />,
                {
                    wrapper: Providers,
                }
            );
            input = document.querySelector('.rbt-input-main');
            fireEvent.click(input);
            fireEvent.change(input, { target: { value: 'jack' } });
        });

        it('Then should have the correct value', () => {
            expect(input.value).toBe('jack');
        });

        it('Then should have the correct dropdown values', async () => {
            await waitFor(() => expect(wrapper.queryByText('Jack Leacher')).toBeTruthy());
            await waitFor(() => expect(wrapper.queryByText('Jack Sparrow')).toBeTruthy());
        });

        it('Then it should not have `Recently added` Header', async () => {
            await waitFor(() => expect(wrapper.queryByText('Recently added:')).toBeNull());
        });
    });
});
