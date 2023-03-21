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

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });
    describe('And the input has a value', () => {
        beforeAll(() => {
            server.listen();
            testUtils.render(<AsyncTypeAheadUsers selectedUsers={mockAuthors} showAuthor currentUserId={123} changeHandler={handler} />);
            input = document.querySelector('.rbt-input-main');
            testUtils.fireEvent.click(input);
            testUtils.fireEvent.change(input, { target: { value: 'jack' } });
        });

        it('Then should have the correct value', () => {
            expect(input.value).toBe('jack');
        });

        it('Then should have the correct dropdown values', async () => {
            await testUtils.waitFor(() => expect(testUtils.screen.getAllByRole('option')[0]).toHaveTextContent('Jack Reacher'));
            await testUtils.waitFor(() => expect(testUtils.screen.getAllByRole('option')[1]).toHaveTextContent('Jack Sparrow'));
        });
    });
});
