import { render, waitFor } from '@testing-library/react';
import React from 'react';
import Cta from './Cta';

const props = {
    iconLeft: <span>Left</span>,
    iconRight: <span>Right</span>,
    className: 'additional-classname',
};

let wrapper;

describe('Given the Alert component', () => {
    describe('When it is rendered', () => {
        beforeEach(() => {
            wrapper = render(<Cta {...props}>Content</Cta>, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            expect(wrapper.container.querySelector('.additional-classname')).toBeTruthy();
        });

        it('Then has the correct icons', async () => {
            const icons = wrapper.container.querySelectorAll('.ui-Icon');
            expect(icons[0].textContent).toEqual('Left');
            expect(icons[1].textContent).toEqual('Right');
        });
    });
});
