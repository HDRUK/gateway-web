import { Button } from 'hdruk-react-core';
import React, { Fragment } from 'react';
import ActionBarMenu from '../../../commonComponents/ActionBarMenu/ActionBarMenu';
import '../../DatasetOnboarding.scss';

const ApplicantActionButtons = ({
    allowedNavigation = false,
    onFormSubmit,
    onNextClick,
    onShowArchiveModal,
    onShowUnArchiveModal,
    onShowCreateNewVersionModal,
    showSubmit,
    submitButtonText,
    showCreateNewVersion,
    showArchive,
    showUnArchive,
    showDeleteDraft,
    onShowDeleteDraftModal,
    onShowDuplicateModal,
    isFederated,
}) => {
    const options = [
        {
            description: 'Manage dataset:',
            actions: [
                {
                    title: 'Duplicate dataset',
                    description: 'Copy metadata into a new dataset',
                    onClick: () => {
                        onShowDuplicateModal();
                    },
                    isVisible: true,
                },
                {
                    title: 'Archive',
                    description: 'Hide this dataset from the main search on the Gateway',
                    onClick: () => {
                        onShowArchiveModal();
                    },
                    isVisible: showArchive,
                },
            ],
        },
    ];

    const availableOptions = options.map(option => {
        option.actions = option.actions.filter(action => action.isVisible);
        return option;
    });

    return (
        <>
            {showDeleteDraft ? (
                <a href='javascript:void(0)' onClick={e => onShowDeleteDraftModal()}>
                    {' '}
                    <span className='rejected-red-semibold-14 deleteDraftDataset cursorPointer'>Delete draft</span>{' '}
                </a>
            ) : (
                ''
            )}

            {!isFederated ? (
                <ActionBarMenu label='Manage dataset' options={availableOptions} disabled={!allowedNavigation} variant='tertiary' />
            ) : (
                ''
            )}

            {/*  {showUnArchive ? <button className={`button-tertiary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onShowUnArchiveModal()}>Un-archive</button> : ''} */}
            {showCreateNewVersion && !isFederated ? (
                <Button
                    variant='tertiary'
                    className={`${allowedNavigation ? '' : 'disabled'}`}
                    onClick={e => onShowCreateNewVersionModal()}>
                    Create a new version
                </Button>
            ) : (
                ''
            )}
            {showSubmit ? (
                <Button variant='secondary' className={`${allowedNavigation ? '' : 'disabled'}`} onClick={e => onFormSubmit()}>
                    {submitButtonText}
                </Button>
            ) : (
                ''
            )}
            <Button className={`${allowedNavigation ? '' : 'disabled'}`} onClick={e => onNextClick()}>
                Next
            </Button>
        </>
    );
};

export default ApplicantActionButtons;
