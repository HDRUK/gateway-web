import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';

const MessageHeader = ({ userState, topic, modalRequired, onRequestAccess, onShowModal }) => {
	let [showDashboard, setShowDashboard] = useState(false);
	let [publisher, setPubliser] = useState('');
	let history = useHistory();

	const showDashboardOption = () => {
		({ title: publisher } = topic);
		setPubliser(publisher);
		let { teams = [] } = userState;
		if (!_.isEmpty(teams)) {
			const hasPublisher = [...teams].map(t => t.name).includes(publisher);
			setShowDashboard(hasPublisher);
		} else {
			setShowDashboard(false);
		}
	};

	const onRouteChange = e => {
		e.preventDefault();
		history.push({ pathname: `/account`, search: `?tab=dataaccessrequests&team=${publisher}`, state: { team: publisher } });
	};

	useEffect(() => {
		showDashboardOption();
	}, [topic]);

	return (
		<Fragment>
			<div className='messageArea-header-desc'>
				<h1 className='black-20 '>{topic.title}</h1>
				{topic.tags.map((tag, index) => (
					<div key={`tag-${index}`} className='badge-tag'>
						{tag}
					</div>
				))}
			</div>
			<div className='messageArea-header-action'>
				{showDashboard ? (
					<div className='purple-14 mr-2 pointer' onClick={e => onRouteChange(e)}>
						Show applications
					</div>
				) : (
					''
				)}
				{modalRequired ? (
					<button className='button-tertiary' onClick={e => onShowModal(e)}>
						How to request access
					</button>
				) : (
					<button className='btn btn-primary ml-2 addButton' onClick={e => onRequestAccess(e)}>
						Request access
					</button>
				)}
			</div>
		</Fragment>
	);
};

export default MessageHeader;
