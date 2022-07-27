import { render, within, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import CustomiseDAREditGuidance from './CustomiseDAREditGuidance';

let containerDiv;
const mockProps = {
    show: true,
    onHide: jest.fn(),
    publisherDetails: {
        dataRequestModalContent: {
            header: '',
            body: 'test content',
            footer: '',
        },
        publisherDetails: {
            accessRights: [],
            dataUseLimitation: [],
            dataUseRequirements: [],
            name: 'CUTOMISE DAR FORM',
            memberOf: 'OTHER',
            contactPoint: '',
        },
        active: true,
        allowsMessaging: false,
        workflowEnabled: false,
        allowAccessRequestManagement: true,
        uses5Safes: false,
        _id: '626a577d9d8825866696b1b3',
        name: 'OTHER > CUTOMISE DAR FORM',
        mdcFolderId: '1170da5d-4310-4379-92a4-56d557e8e45c',
        dataRequestModalContentUpdatedBy: 2623650828181272,
        dataRequestModalContentUpdatedOn: '2022-04-28T11:16:27.740Z',
    },
};

describe('Given the CustomiseDAREditGuidance component', () => {
    describe('When it is rendered', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = render(<CustomiseDAREditGuidance {...mockProps} />, {
                wrapper: Providers,
            });
        });

        it('Should match the snapshot', async () => {
            expect(containerDiv).toMatchSnapshot();
        });

        it('Then the title and description should be rendered', async () => {
            expect(wrapper.getByTestId('modalHeading')).toHaveTextContent('Edit your guidance to data applicants');
            expect(wrapper.getByTestId('modalDesc')).toHaveTextContent(
                "The text below is shown to data applicants when they click on the 'How to access' button for CUTOMISE DAR FORM datasets"
            );
        });

        describe('publish modal', () => {
            it('Then onClick Publish Button the Modal should open', async () => {
                fireEvent.click(wrapper.getByTestId('publish-guidance'));
                await waitFor(() =>
                    expect(wrapper.getByTestId('modalHeading')).toHaveTextContent(
                        "Publish 'Applicant guidance for requesting access to data'"
                    )
                );
                await waitFor(() =>
                    expect(wrapper.getByTestId('modalDesc')).toHaveTextContent(
                        'Selecting Publish will make your updates live on the Gateway for CUTOMISE DAR FORM datasets.'
                    )
                );
            });
            it('Then onClick Cancel Button the Modal should be closed and previous modal should be shown', async () => {
                fireEvent.click(wrapper.getByTestId('confirm-cancel-publish'));
                await waitFor(() => expect(wrapper.getByTestId('modalHeading')).toHaveTextContent('Edit your guidance to data applicants'));
            });
        });

        describe('cancel publish modal', () => {
            it('Then onClick Cancel Button the cancel Modal should open', async () => {
                fireEvent.click(wrapper.getByTestId('cancel-publish'));
                await waitFor(() =>
                    expect(wrapper.getByTestId('modalHeading')).toHaveTextContent(
                        "Cancel 'Applicant guidance for requesting access to data'"
                    )
                );
                await waitFor(() =>
                    expect(wrapper.getByTestId('modalDesc')).toHaveTextContent(
                        'Are you sure you want to leave this page? Any changes you have made have not been published and will not be saved.'
                    )
                );
            });
            it('Then onClick Cancel Button the Modal should be closed and previous modal should be shown', async () => {
                fireEvent.click(wrapper.getByTestId('confirm-cancel'));
                await waitFor(() => expect(wrapper.getByTestId('modalHeading')).toHaveTextContent('Edit your guidance to data applicants'));
            });
        });
    });
});
