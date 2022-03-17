import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import DropdownCustom from './DropdownCustom';
import { server } from '../../../../services/mockServer';
import '@testing-library/jest-dom/extend-expect';

const dropdownCustomProps = {
    name: 'safepeopleprimaryapplicantfullname',
    id: 'safepeopleprimaryapplicantfullname',
    questionSetId: 'primaryapplicant',
    labelId: 'safepeopleprimaryapplicantfullname-label',
    value: 'Ciara Ward',
    disabled: false,
    required: true,
    readOnly: false,
    classes: {
        form: 'dar-form',
        select: 'form-control',
        typeaheadCustom: 'form-control',
        datePickerCustom: 'form-control',
        question: 'form-group',
        questionWrap: 'question-wrap',
        input: 'form-control',
        button: 'btn btn-primary',
        radioListItem: 'dar__radio--item',
        radioList: 'dar__radio--list list-group',
        checkboxInput: 'checkbox list-group',
        checkboxListItem: 'dar__check--item ',
        checkboxList: 'dar__check list-group',
        controlButton: 'btn btn-primary pull-right',
        backButton: 'btn btn-default pull-left',
        errorMessage: 'alert alert-danger',
        alertWrap: 'alert-wrap',
        buttonBar: 'button-bar hidden',
        actionControl: 'action-control',
        nested: 'nested',
        toolTip: 'toolTip',
        toolTipTop: 'toolTip-top',
        toolTipText: 'toolTipText',
        actionCount: 'actionCount',
        actionNotifications: 'action-notifications',
    },
    applicationId: 123,
};
let wrapper;
let input;
describe('Given the DropdownCustom component', () => {
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
            wrapper = render(<DropdownCustom {...dropdownCustomProps} />, {
                wrapper: Providers,
            });
            input = document.querySelector('.rbt-input-main');
            fireEvent.click(input);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then name should be rendered for 3 contributors', async () => {
            await waitFor(() => {
                expect(wrapper.getByTestId('darContributorDropdownName-0')).toHaveTextContent('Ciara Ward');
                expect(wrapper.getByTestId('darContributorDropdownName-1')).toHaveTextContent('Paul McCafferty (contributor)');
                expect(wrapper.getByTestId('darContributorDropdownName-2')).toHaveTextContent('Ciara Test (contributor)');
            });
        });

        it('Then email should be rendered for only the logged in users email displayed', async () => {
            await waitFor(() => {
                expect(wrapper.getByTestId('darContributorDropdownEmail-0')).toHaveTextContent('ciara.ward@paconsulting.com');
                expect(wrapper.getByTestId('darContributorDropdownEmail-1')).toHaveTextContent('Email address cannot be shown');
                expect(wrapper.getByTestId('darContributorDropdownEmail-2')).toHaveTextContent('Email address cannot be shown');
            });
        });

        it('Then renders with the correct organisations shown and hidden', async () => {
            await waitFor(() => {
                expect(wrapper.getByTestId('darContributorDropdownOrganisation-0')).toHaveTextContent('test');
                expect(wrapper.getByTestId('darContributorDropdownOrganisation-1')).toHaveTextContent('PA Consulting');
                expect(wrapper.getByTestId('darContributorDropdownOrganisation-2')).toHaveTextContent('Organisation cannot be shown');
            });
        });
    });
});
