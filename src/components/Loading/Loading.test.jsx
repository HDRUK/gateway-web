import React from 'react';
import { render } from '@testing-library/react';
import Loading from './Loading';

let wrapper;
jest.setTimeout(30000);
const props = {
    text: 'loading...',
    subText: 'still loading....',
    timeout: 3000,
};

describe('Given the Loading component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Loading {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then contains the correct text', () => {
            expect(wrapper.getByText('loading...')).toBeTruthy();
        });

        it('Then contains the sub text', async () => {
            await new Promise(r => setTimeout(r, 4000));
            expect(wrapper.getByText('still loading....')).toBeTruthy();
        });
    });
});
