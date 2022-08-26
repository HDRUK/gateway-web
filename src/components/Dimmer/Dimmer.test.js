import { render } from '@testing-library/react';
import React from 'react';
import Dimmer from './Dimmer';

let wrapper;

describe('Given the Alert component', () => {
    describe('When it is rendered', () => {
        beforeEach(() => {
            wrapper = render(<Dimmer>Content</Dimmer>, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });
    });
});
