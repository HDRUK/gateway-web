import React from 'react';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';
import SelectedOption from './SelectedOption';
import SVGIcon from '../../../../images/SVGIcon';
import tickSVG from '../../../../images/tick.svg';

import './DoubleDropdowncustom.scss';

class DoubleDropdownCustom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			dropdownMenu: false,
			nestedDropdownMenu: false,
		};
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.openDropDown = this.openDropDown.bind(this);
		this.openNestedDropDown = this.openNestedDropDown.bind(this);
		this.changingSelect = this.changingSelect.bind(this);
		this.removeSelectedOption = this.removeSelectedOption.bind(this);
	}

	changingSelect(eventKey) {
		if (this.state.value.indexOf(eventKey) === -1) {
			this.setState({ value: [...this.state.value, eventKey] }, this.props.onChange.bind(null, [...this.state.value, eventKey]));
		}
	}

	removeSelectedOption(option) {
		this.setState(
			{ value: this.state.value.filter(val => val !== option) },
			this.props.onChange.bind(
				null,
				this.state.value.filter(val => val !== option)
			)
		);
	}

	handleFocus(e) {
		this.props.onFocus();
	}
	handleBlur(e) {
		this.props.onBlur(this.props.value);
	}

	openDropDown() {
		this.setState({ dropdownMenu: true });
	}

	openNestedDropDown() {
		this.setState({ nestedDropdownMenu: true });
	}

	render() {
		const extra = this.props.options
			.map(a => a.extraOptions)
			.filter(b => b)
			.pop([]);

		return (
			<Navbar collapseOnSelect expand='lg'>
				<Nav className='mr-auto'>
					<Dropdown onSelect={this.changingSelect} onFocus={this.handleFocus} onToggle={this.openDropDown} autoClose={false}>
						<Dropdown.Toggle className='double-dropdown-input' id={this.props.id}>
							<div className='selected-options-container'>
								{this.state.value.map(selectedValue => {
									return <SelectedOption text={selectedValue} close={() => this.removeSelectedOption(selectedValue)}></SelectedOption>;
								})}
							</div>
							<SVGIcon
								width='20px'
								height='20px'
								name='chevronbottom'
								fill={'#475da7'}
								className={!this.state.dropdownMenu ? 'chevron main-dropdown-arrow' : 'chevron flip180 main-dropdown-arrow'}
							/>
						</Dropdown.Toggle>
						<Dropdown.Menu className={'dropdown-menu'}>
							{this.props.options.map(b =>
								b.value === 'Biomedical research' ? (
									<Dropdown className='nested-dropdown-whole' onToggle={this.openNestedDropDown}>
										<Dropdown.Toggle className='nested-dropdown'>
											Biomedical research
											<SVGIcon
												width='20px'
												height='20px'
												name='chevronbottom'
												fill={'#475da7'}
												className={!this.state.nestedDropdownMenu ? 'chevron nest-dropdown-arrow' : 'chevron flip180 nest-dropdown-arrow'}
											/>
										</Dropdown.Toggle>

										<Dropdown.Menu className='nested-dropdown-menu'>
											{extra.map(a => (
												<Dropdown.Item eventKey={a.text} onSelect={this.changingSelect}>
													{a.value}
													{this.state.value.includes(a.value) && (
														<img src={tickSVG} width='20' style={{ float: 'right', marginTop: '3px' }} />
													)}
												</Dropdown.Item>
											))}
										</Dropdown.Menu>
									</Dropdown>
								) : (
									<Dropdown.Item eventKey={b.value}>
										{b.value}
										{this.state.value.includes(b.value) && <img src={tickSVG} width='20' style={{ float: 'right', marginTop: '3px' }} />}
									</Dropdown.Item>
								)
							)}
						</Dropdown.Menu>
					</Dropdown>
				</Nav>
			</Navbar>
		);
	}
}

DoubleDropdownCustom.defaultProps = {
	value: [],
	onChange: () => {},
	onSelect: () => {},
	onFocus: () => {},
	onBlur: () => {},
};

export default DoubleDropdownCustom;
