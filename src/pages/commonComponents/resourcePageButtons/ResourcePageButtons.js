import React from 'react';
import { Button } from 'react-bootstrap';
import AddToCollection from '../addToCollection/AddToCollection';

const ResourcePageButtons = props => {
	return (
		<>
			{props.userState[0].loggedIn &&
			props.data.type !== 'dataset' &&
			((props.data.authors && props.data.authors.includes(props.userState[0].id)) ||
				(props.data.creator && props.data.creator[0].id === props.userState[0].id) ||
				props.userState[0].role === 'Admin') ? (
				<Button variant='white' href={'/' + props.data.type + '/edit/' + props.data.id} className='techDetailButton mr-2'>
					Edit
				</Button>
			) : (
				''
			)}

			{props.data.type === 'dataset' ? (
				<Button
					variant='white'
					href={'https://metadata-catalogue.org/hdruk/#/catalogue/dataModel/' + props.data.datasetid}
					target='_blank'
					className='techDetailButton mr-2'>
					Technical details
				</Button>
			) : (
				''
			)}

			{props.userState[0].loggedIn ? (
				<AddToCollection className='addToCollectionButton' data={props.data} userState={props.userState} />
			) : (
				''
			)}
		</>
	);
};

export default ResourcePageButtons;
