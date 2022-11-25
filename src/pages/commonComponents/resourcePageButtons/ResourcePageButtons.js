import React, { useState, useEffect } from 'react';
import { Button } from 'hdruk-react-core';
import AddToCollection from '../addToCollection/AddToCollection';

const ResourcePageButtons = props => {
    const [type, setType] = useState('');

    useEffect(() => {
        if (props.isCollection === true) {
            setType('collection');
        } else {
            setType(props.data.type);
        }
    }, [props.data.type, props.isCollection]);

    // TODO: GAT-1510:022
    return (
        <div className='floatRight row'>
            {props.userState[0].loggedIn &&
            props.data.type !== 'dataset' &&
            props.data.type !== 'dataUseRegister' &&
            ((props.data.authors && props.data.authors.includes(props.userState[0].id)) ||
                (props.data.creator && props.data.creator[0].id === props.userState[0].id) ||
                props.userState[0].role === 'Admin') ? (
                <Button
                    data-testid='action-bar-edit'
                    variant='secondary'
                    href={`/${type}/edit/${props.data.id}`}
                    className='techDetailButton mr-2'>
                    Edit
                </Button>
            ) : (
                ''
            )}

            {props.data.type === 'dataset' ? (
                <>
                    <Button mr={2} variant='secondary' onClick={props.exportCitation}>
                        Export citation
                    </Button>
                    <a
                        className='nested-button'
                        rel='noopener noreferrer'
                        href={`${process.env.REACT_APP_METADATA_CATALOG}/#/catalogue/dataModel/${props.data.datasetid}`}
                        target='_blank'>
                        <Button mr={2} variant='secondary'>
                            Technical details
                        </Button>
                    </a>
                </>
            ) : (
                ''
            )}

            {props.userState[0].loggedIn && props.isCollection !== true ? (
                <AddToCollection className='addToCollectionButton' data={props.data} userState={props.userState} />
            ) : (
                ''
            )}
        </div>
    );
};

export default ResourcePageButtons;
