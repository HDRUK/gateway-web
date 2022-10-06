import React, { useState, useEffect, useCallback } from 'react';
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

    const handleGoToCatalog = useCallback(() => {
        window.open(`${process.env.REACT_APP_METADATA_CATALOG}/#/catalogue/dataModel/${props.data.datasetid}`, '_blank');
    }, [props.data.datasetid]);

    const handleGoToEdit = useCallback(() => {
        window.location.assign(`/${type}/edit/${props.data.id}`);
    }, [type, props.data.id]);

    // TODO: GAT-1510:022
    return (
        <div className='floatRight row'>
            {props.userState[0].loggedIn &&
            props.data.type !== 'dataset' &&
            props.data.type !== 'dataUseRegister' &&
            ((props.data.authors && props.data.authors.includes(props.userState[0].id)) ||
                (props.data.creator && props.data.creator[0].id === props.userState[0].id) ||
                props.userState[0].role === 'Admin') ? (
                <Button data-test-id='action-bar-edit' onClick={handleGoToEdit} variant='secondary' className='techDetailButton mr-2'>
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
                    <Button variant='secondary' onClick={handleGoToCatalog} target='_blank' className='techDetailButton mr-2'>
                        Technical details
                    </Button>
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
