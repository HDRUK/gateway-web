import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import Typeahead from '.';
import { omit, pick } from '../../configs/propTypes';

const mockInput = jest.fn();
const mockOnChange = jest.fn();
const mockBootstrapTypeahead = jest.fn();
const mockBootstrapTypeaheadAsync = jest.fn();

jest.mock('../Input', () => props => {
    mockInput(props);
    return <div>{props.children}</div>;
});

jest.mock('react-bootstrap-typeahead', () => {
    return {
        ...jest.requireActual('react-bootstrap-typeahead'),
        Typeahead: props => {
            mockBootstrapTypeahead(props);
            return <div />;
        },
        TypeaheadAsync: props => {
            mockBootstrapTypeaheadAsync(props);
            return <div />;
        },
    };
});

const props = {
    options: ['United Kingdon, Cambridge', 'United States'],
    onChange: mockOnChange,
    iconPrepend: 'Icon prepend',
    textPrepend: 'Text prepend',
    iconAppend: 'Icon append',
    textAppend: 'Text append',
    className: 'additional-class',
    mt: 1,
    mb: 2,
    mr: 3,
    ml: 4,
    minWidth: '100',
    maxWidth: '200',
    width: '300',
};

let input;
let wrapper;

describe('Given the Typeahead component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Typeahead {...props} />, {
                wrapper: Providers,
            });

            input = document.querySelectorAll('input')[0];
        });

        it('Then should match the snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then should call the input with the correct parameters', () => {
            expect(mockInput.mock.calls[0][0]).toMatchObject({
                ...omit(props, ['onChange', 'options']),
                variant: 'primary',
                className: 'additional-class ui-Typeahead',
            });
        });

        it('Then should call typeahead with the correct parameters', () => {
            expect(mockBootstrapTypeahead).toHaveBeenCalledWith(pick(props, ['onChange', 'options']));
        });

        describe('And it is async', () => {
            it('Then should call the typeahead ASYNC with the correct parameters', () => {
                wrapper = render(<Typeahead {...props} async />, {
                    wrapper: Providers,
                });

                expect(mockBootstrapTypeaheadAsync).toHaveBeenCalledWith(pick(props, ['onChange', 'options']));
            });
        });
    });
});
