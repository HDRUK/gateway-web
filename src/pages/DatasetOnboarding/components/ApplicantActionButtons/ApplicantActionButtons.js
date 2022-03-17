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

            <ActionBarMenu label='Manage dataset' options={availableOptions} disabled={!allowedNavigation} buttonClass='button-tertiary' />

            {/*  {showUnArchive ? <button className={`button-tertiary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onShowUnArchiveModal()}>Un-archive</button> : ''} */}
            {showCreateNewVersion ? (
                <button className={`button-tertiary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onShowCreateNewVersionModal()}>
                    Create a new version
                </button>
            ) : (
                ''
            )}
            {showSubmit ? (
                <button className={`button-secondary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onFormSubmit()}>
                    {submitButtonText}
                </button>
            ) : (
                ''
            )}
            <button className={`button-primary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onNextClick()}>
                Next
            </button>
        </>
    );
};

export default ApplicantActionButtons;
