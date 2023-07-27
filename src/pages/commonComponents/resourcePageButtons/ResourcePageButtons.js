import { useState, useEffect } from 'react';
import { Button } from 'hdruk-react-core';
import { useAuth } from 'context/AuthContext';
import { Link } from 'react-router-dom';
import AddToCollection from '../addToCollection/AddToCollection';

const ResourcePageButtons = props => {
    const [type, setType] = useState('');
    const { isRootAdmin } = useAuth();

    useEffect(() => {
        if (props.isCollection === true) {
            setType('collection');
        } else {
            setType(props.data.type);
        }
    }, [props.data.type, props.isCollection]);

    return (
        <div className='floatRight row'>
            {props.userState[0].loggedIn &&
            props.data.type !== 'dataset' &&
            props.data.type !== 'dataUseRegister' &&
            ((props.data.authors && props.data.authors.includes(props.userState[0].id)) ||
                (props.data.creator && props.data.creator[0].id === props.userState[0].id) ||
                isRootAdmin) ? (
                    <Link to={`/${type}/edit/${props.data.id}`}>
                        <Button
                            data-testid='action-bar-edit'
                            variant='secondary'
                            className='techDetailButton mr-2'>
                            Edit
                        </Button>
                    </Link>
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
                        href={`${process.env.REACT_APP_METADATA_CATALOG_URL}/#/catalogue/dataModel/${props.data.datasetid}`}
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
