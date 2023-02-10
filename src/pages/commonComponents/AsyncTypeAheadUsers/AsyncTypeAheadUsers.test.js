import { testUtils } from '../../../../test';
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
            wrapper = testUtils.render(
                <AsyncTypeAheadUsers selectedUsers={mockAuthors} showAuthor currentUserId={123} changeHandler={handler} />
            );
            input = document.querySelector('.rbt-input-main');
            testUtils.fireEvent.click(input);
        });

        afterAll(() => {
            testUtils.cleanup();
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then default values should be set', () => {
            expect(wrapper.getByText('Jack Reacher')).toBeTruthy();
            expect(wrapper.getByText('Tom Cruise')).toBeTruthy();
        });

        // todo: rewrite component
        it.skip('Then name should be rendered for 2 contributors', async () => {
            await testUtils.waitFor(() => {
                expect(wrapper.getByText('Test1 Test1')).toBeTruthy();
                expect(wrapper.getByText('Test2 Test2')).toBeTruthy();
            });
        });

        // todo: rewrite component
        it.skip('Then it should  have `Recently added` Header', async () => {
            await testUtils.waitFor(() => expect(wrapper.getByText('Recently added:')).toBeTruthy());
        });
    });
    describe('And the input has a value', () => {
        beforeAll(() => {
            server.listen();
            wrapper = testUtils.render(
                <AsyncTypeAheadUsers selectedUsers={mockAuthors} showAuthor currentUserId={123} changeHandler={handler} />
            );
            input = document.querySelector('.rbt-input-main');
            testUtils.fireEvent.click(input);
            testUtils.fireEvent.change(input, { target: { value: 'jack' } });
        });

        afterAll(() => {
            testUtils.cleanup();
        });
        it('Then should have the correct value', () => {
            expect(input.value).toBe('jack');
        });

        it('Then should have the correct dropdown values', async () => {
            await testUtils.waitFor(() => expect(wrapper.queryByText('Jack Reacher')).toBeTruthy());
            await testUtils.waitFor(() => expect(wrapper.queryByText('Tom Cruise')).toBeTruthy());
        });

        it('Then it should not have `Recently added` Header', async () => {
            await testUtils.waitFor(() => expect(wrapper.queryByText('Recently added:')).toBeNull());
        });
    });
});
