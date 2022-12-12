import React from 'react';
import LoginSSOButtons from './index';
import _ from 'lodash';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const props = {
    ssoBtnsConfig: [
        { id: 'google', text: 'Sign in with Google', authURL: '/auth/google', img: 'googleIcon', active: false },
        { id: 'openAthens', text: 'Sign in with institution', authURL: '/auth/oidc', img: 'instIcon', active: false },
        { id: 'azure', text: 'Sign in with Microsoft', authURL: '/auth/azure', img: 'microsoftIcon', active: false },
    ],
    communityLink: 'https://test',
};
let wrapper;
let handlerFn;

describe('Given the LoginSSOButtons component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<LoginSSOButtons {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then all buttons rendered', () => {
            props.ssoBtnsConfig.map(value => {
                expect(screen.getByTestId(value.id)).toBeTruthy();
            });
        });

        it('Then lastChoice Messgage should not be rendered', () => {
            expect(screen.queryByTestId('lastChoiceNote')).toBeNull();
        });

        it('Then Suggest another Indentity Provider link should  be rendered', () => {
            expect(screen.getByTestId('communityLink')).toHaveAttribute(
                'href',
                `${props.communityLink}/t/how-to-submit-a-feature-request-or-feedback/1`
            );
        });
    });

    describe('And lastchoice is google', () => {
        it('Then has the correct output button with lastChoiceSVG icon', () => {
            const { rerender, container } = wrapper;
            handlerFn = jest.fn();
            rerender(<LoginSSOButtons {...props} lastChoice='google' clickHandler={handlerFn} />);
            props.ssoBtnsConfig.map(value => {
                expect(screen.getByTestId(value.id)).toBeTruthy();
                if (value.id === 'google') {
                    expect(screen.getByTestId(value.id + '-lastChoice')).toBeTruthy();
                } else {
                    expect(screen.queryByTestId(value.id + '-lastChoice')).toBeNull();
                }
            });
        });
        it('Then has Last Time you clicked this button text', () => {
            expect(screen.getByTestId('lastChoiceNote')).toBeTruthy();
        });
        it('Then should call clickHandlder function when google button clicked', () => {
            fireEvent.click(screen.getByTestId('google'));
            expect(handlerFn.mock.calls.length).toBe(1);
            expect(handlerFn.mock.calls[0][0]).toBe('google');
            expect(handlerFn.mock.calls[0][1]).toBe('/auth/google');
        });
    });
    describe('And lastchoice is azure', () => {
        it('Then has the correct output button with lastChoiceSVG icon', () => {
            const { rerender, container } = wrapper;
            handlerFn = jest.fn();
            rerender(<LoginSSOButtons {...props} lastChoice='azure' clickHandler={handlerFn} />);
            props.ssoBtnsConfig.map(value => {
                expect(screen.getByTestId(value.id)).toBeTruthy();
                if (value.id === 'azure') {
                    expect(screen.getByTestId(value.id + '-lastChoice')).toBeTruthy();
                } else {
                    expect(screen.queryByTestId(value.id + '-lastChoice')).toBeNull();
                }
            });
        });
        it('Then has Last Time you clicked this button text', () => {
            expect(screen.getByTestId('lastChoiceNote')).toBeTruthy();
        });
        it('Then should call clickHandlder function when azure button clicked', () => {
            fireEvent.click(screen.getByTestId('azure'));
            // expect(props.clickHandler.mock.calls.length).toBe(1);
            expect(handlerFn.mock.calls[0][0]).toBe('azure');
            expect(handlerFn.mock.calls[0][1]).toBe('/auth/azure');
        });
    });
});
