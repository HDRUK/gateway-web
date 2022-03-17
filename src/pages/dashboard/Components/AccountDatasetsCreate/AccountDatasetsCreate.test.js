import { render, createEvent, waitFor } from '@testing-library/react';
import React from 'react';
import AccountDatasetsCreate from '.';
import { server } from '../../../../services/mockServer';

let wrapper;

const props = { publisherID: 'admin', team: '1234', alert: { message: 'Sample message' } };

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
            wrapper = render(<AccountDatasetsCreate {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        describe('And "Add new dataset" is clicked', () => {
            it('Then calls preventDefault', async () => {
                const button = wrapper.container.querySelector('button');
                const buttonEvent = createEvent.click(button, { cancelable: true });

                fireEvent.click(button, buttonEvent);

                expect(wrapper.container).toMatchSnapshot();
            });
        });
    });
});
