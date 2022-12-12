import { render } from '@testing-library/react';
import * as formik from 'formik';
import React from 'react';
import SearchControls from '.';

const mockOnSubmit = jest.fn();
const mockSearchControlsForm = jest.fn();

jest.mock('./SearchControlsForm', () => props => {
    mockSearchControlsForm(props);
    return <div />;
});

const props = {
    onSubmit: mockOnSubmit,
    isLoading: true,
    sortProps: {
        value: 'relevance',
        options: ['relevance'],
    },
    inputProps: {
        value: 'dataset',
    },
};

let wrapper;

const formikSpy = jest.spyOn(formik, 'Formik');

describe('Given the SearchControls component', () => {
    describe('When it is loading', () => {
        beforeAll(() => {
            wrapper = render(<SearchControls {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container.textContent).toEqual('');
        });
    });

    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<SearchControls {...props} isLoading={false} />, {
                wrapper: Providers,
            });
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('Then calls the form with the correct props', () => {
            expect(mockSearchControlsForm).toHaveBeenCalledWith({ inputProps: props.inputProps, sortProps: props.sortProps });
        });

        it('Then calls formik with the correct props', () => {
            expect(formikSpy.mock.calls[0][0]).toMatchObject({
                children: expect.any(Object),
                initialValues: { search: 'dataset', sortBy: 'relevance' },
                onSubmit: mockOnSubmit,
            });
        });
    });

    describe('When it is rendered without values', () => {
        beforeAll(() => {
            wrapper = render(<SearchControls {...props} isLoading={false} inputProps={{}} sortProps={{}} />, {
                wrapper: Providers,
            });
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('Then calls the form with the correct props', () => {
            expect(mockSearchControlsForm).toHaveBeenCalledWith({ inputProps: {}, sortProps: {} });
        });

        it('Then calls formik with the correct props', () => {
            expect(formikSpy.mock.calls[0][0]).toMatchObject({
                initialValues: { search: '', sortBy: '' },
                onSubmit: mockOnSubmit,
            });
        });
    });
});
