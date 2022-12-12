import { render } from '@testing-library/react';
import AlertMessage from './AlertMessage';

const props = {
    onClose: jest.fn(),
    variant: 'success',
};

let wrapper;

describe('Given the AlertMessage component', () => {
    describe('When it is rendered', () => {
        beforeEach(() => {
            wrapper = render(<AlertMessage {...props}>Content</AlertMessage>, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct icon', async () => {
            expect(wrapper.container.querySelector('.ui-Icon')).toBeTruthy();
        });

        describe('And it has an icon specified', () => {
            it('Then has the correct icon shown', () => {
                wrapper.rerender(
                    <AlertMessage {...props} icon='Icon'>
                        Content
                    </AlertMessage>
                );

                expect(wrapper.getByText('Icon')).toBeTruthy();
                expect(wrapper.container.querySelector('.ui-Icon')).toBeFalsy();
            });
        });
    });
});
