import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
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

	return (
		<div className='floatRight row'>
			{props.userState[0].loggedIn &&
			props.data.type !== 'dataset' &&
			((props.data.authors && props.data.authors.includes(props.userState[0].id)) ||
				(props.data.creator && props.data.creator[0].id === props.userState[0].id) ||
				props.userState[0].role === 'Admin') ? (
				<Button
					data-test-id='action-bar-edit'
					variant='white'
					href={'/' + type + '/edit/' + props.data.id}
					className='techDetailButton mr-2'>
					Edit
				</Button>
			) : (
				''
			)}

			{props.data.type === 'dataset' ? (
				<>
					<Button variant='white' onClick={props.exportCitation} className='techDetailButton mr-2'>
						Export citation
					</Button>
					<Button
						variant='white'
						href={'https://metadata-catalogue.org/hdruk/#/catalogue/dataModel/' + props.data.datasetid}
						target='_blank'
						className='techDetailButton mr-2'>
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
