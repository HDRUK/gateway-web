import { testUtils } from '../../../../../test';
import AccountDatasetsCreate from '.';
import { server } from '../../../../services/mockServer';

let wrapper;

const props = { publisherID: 'admin', teamId: '1234', alert: { message: 'Sample message' }, isFederated: false, isLoading: false };

describe('Given the AccountDatasetsCreate component', () => {
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
        beforeAll(async () => {
            wrapper = testUtils.render(<AccountDatasetsCreate {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        describe('And "Add new dataset" is clicked', () => {
            it('Then calls preventDefault', async () => {
                const button = wrapper.queryByText(/Add a new dataset/i);
                const buttonEvent = testUtils.createEvent.click(button, { cancelable: true });

                testUtils.fireEvent.click(button, buttonEvent);

                expect(wrapper.container).toMatchSnapshot();
            });
        });

        describe('And the user is federated', () => {
            it('Then hides create new datatset', async () => {
                wrapper.rerender(<AccountDatasetsCreate {...props} isFederated />);

                expect(wrapper.queryByText(/Add a new dataset/i)).toBeNull();
            });
        });

        describe('And data is loading', () => {
            it('Then hides create new datatset', async () => {
                wrapper.rerender(<AccountDatasetsCreate {...props} isLoading />);

                expect(wrapper.queryByText(/Add a new dataset/i)).toBeNull();
            });
        });
    });
});
