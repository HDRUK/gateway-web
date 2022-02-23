import React, { useState, useEffect } from 'react';
import { Modal, InputGroup, FormText } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import SVGIcon from '../../../images/SVGIcon';
import './DataUtilityWizard.scss';
import _ from 'lodash';
import { Typeahead } from 'react-bootstrap-typeahead';
import googleAnalytics from '../../../tracking';

const DataUtilityWizardModal = ({
	open,
	closed,
	dataUtilityWizardSteps,
	updateFilterStates,
	datasetCount,
	doSearchCall,
	selectedItems,
	handleClearSelection,
	searchValue,
	activeStep,
	onWizardComplete,
	onStepChange,
}) => {
	const [stepCounter, setStepCounter] = useState(1);
	let [typeaheadOption, setTypeaheadOption] = useState([]);

	useEffect(() => {
		setStepCounter(activeStep);
	}, [open]);

	const recordWizardCloseEvent = () => {
		const finalFilters = selectedItems.reduce((str, item) => {
			return `${str} ${item.parentKey}: ${item.label}`;
		}, '');

		googleAnalytics.recordEvent(
			'Datasets',
			`Viewing ${datasetCount} dataset(s) from data utility wizard search`,
			`Filter value(s): ${finalFilters} ${searchValue ? `| Search value: ${searchValue}` : ``}`
		);
	};

	const changeFilter = async (stepKey, impliedValues, entryLabel, wizardStepTitle) => {
		// Formats the implied values to be accepted by the updateFilterStates function
		// e.g: [x, y, z] ---> X::Y::Z
		for (var i = 0; i < impliedValues.length; i++) {
			impliedValues[i] = impliedValues[i].charAt(0).toUpperCase() + impliedValues[i].substr(1);
		}
		let formattedImpliedValues = impliedValues.join('::');
		let searchObject = {};
		searchObject[stepKey] = formattedImpliedValues;

		// Passes filters into the updateFilterStates function
		await updateFilterStates(searchObject);
		// // Checks if the current step has any selected buttons and clears them on change
		const currentStepSelection = selectedItems.find(item => item.parentKey === stepKey);
		currentStepSelection ? handleClearSelection(currentStepSelection) : doSearchCall();

		googleAnalytics.recordEvent(
			'Datasets',
			`Applied data utility wizard filter in step ${activeStep} - ${wizardStepTitle}`,
			`Filter value: ${entryLabel}`
		);
	};

	const dataUtilityWizardJourney = () => {
		return (
			<div className='data-utility-wizard-modal-body'>
				{dataUtilityWizardSteps.map(step => {
					if (step && step.includeInWizard && step.wizardStepOrder === stepCounter) {
						return (
							<>
								<p className='gray800-14 mb-1'>
									Question {stepCounter} of {dataUtilityWizardSteps.length}
								</p>
								<div className='data-utility-wizard-title'>
									<h5 className='black-20 mb-0 mr-1'> {step.wizardStepTitle}</h5>

									{_.times(dataUtilityWizardSteps.length, index => {
										if (stepCounter - 1 === index) return <div className='current-question'></div>;
										if (stepCounter - 1 > index) return <div className='previous-question'></div>;
										if (stepCounter - 1 < index) return <div className='next-question'></div>;
									})}
								</div>
								<p className='gray800-14 mt-4'>{step.wizardStepDescription}</p>
								{step.wizardStepType === 'radio' && (
									<div className='radio-buttons-container'>
										{step.entries.map(entry => {
											return (
												<InputGroup className='mb-2'>
													<InputGroup.Prepend>
														<InputGroup.Radio
															aria-label='Radio button for following text input'
															name={'radioButtonSet' + stepCounter}
															value={entry.impliedValues}
															onChange={() => changeFilter(step.key, entry.impliedValues, entry.label, step.wizardStepTitle)}
															checked={entry.label === selectedItems.find(item => item.parentKey === step.key)?.label}
														/>
													</InputGroup.Prepend>
													<FormText className='ml-3'>{entry.labelAlias ? entry.labelAlias : entry.label}</FormText>
												</InputGroup>
											);
										})}
									</div>
								)}

								{step.wizardStepType === 'search' && (
									<div className='data-utility-wizard-modal-search'>
										<div className='data-utility-wizard-modal-search-icon'>
											<SVGIcon name='searchicon' width={16} height={16} fill={'#2c8267'} />
										</div>
										<div className='data-utility-wizard-modal-search-input'>
											<Typeahead
												id={'typeaheadDataUtilityWizard'}
												onChange={input => {
													doSearchCall(false, input);
												}}
												clearButton
												options={typeaheadOption}
												defaultSelected={searchValue}
												selected={searchValue}
												onInputChange={input => setTypeaheadOption([input])}
											/>
										</div>
									</div>
								)}
							</>
						);
					}
				})}
			</div>
		);
	};

	return (
		<Modal
			show={open}
			onHide={closed}
			className='data-utility-wizard-modal'
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered>
			<div className='data-utility-wizard-header'>
				<CloseButtonSvg className='data-utility-wizard-modal-close' onClick={closed} />
				<div className='data-utility-wizard-header--wrap'>
					<h5 className='black-20'> Data Utility Wizard</h5>

					<div className='Use-this-tool-to-fin'>
						Use this tool to find the datasets you require through 6 key data utility filters: allowable uses, time lag, length of follow
						up, data model, provenance and search terms.
					</div>
				</div>
			</div>

			<div className='data-utility-wizard-body'>
				<div className='data-utility-wizard-body--wrap'>{dataUtilityWizardJourney()}</div>
			</div>
			<div className='data-utility-wizard-footer'>
				<div className='data-utility-wizard-footer--wrap'>
					{stepCounter > 1 && (
						<button
							className='button-tertiary'
							style={{ marginRight: 'auto' }}
							onClick={() => {
								setStepCounter(stepCounter => stepCounter - 1);
								onStepChange(stepCounter - 1);
							}}>
							Back
						</button>
					)}
					<button
						className='button-secondary'
						style={{ marginLeft: 'auto' }}
						onClick={() => {
							closed();
							onWizardComplete(true);
							recordWizardCloseEvent();
						}}>
						View {datasetCount} dataset matches
					</button>
					{stepCounter < dataUtilityWizardSteps.length && (
						<button
							className='button-primary ml-3'
							onClick={() => {
								setStepCounter(stepCounter => stepCounter + 1);
								onStepChange(stepCounter + 1);
							}}>
							Next
						</button>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default DataUtilityWizardModal;
