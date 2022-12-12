import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class DatePickerCustom extends React.Component {
    constructor(props) {
        super(props);
        let date = null;
        if (moment(this.props.value, 'DD/MM/YYYY').isValid()) {
            date = moment(this.props.value, 'DD/MM/YYYY').toDate();
        }
        this.state = {
            date,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { value } = nextProps;

        if (!_.isNil(value)) value = moment(value, 'DD/MM/YYYY').toDate();

        if (this.props.value !== value) this.setState({ date: value });
    }

    handleChange(e) {
        this.setState(
            {
                date: e,
            },
            this.props.onChange.bind(null, !_.isNil(e) ? moment(e).format('DD/MM/YYYY') : e)
        );
    }

    handleFocus(e) {
        this.props.onFocus();
    }

    handleBlur(e) {
        this.props.onBlur(this.props.value);
    }

    handleChangeRaw(e) {
        e.preventDefault();
    }

    render() {
        return (
            <DatePicker
                disabled={this.props.readOnly || this.props.disabled}
                name={this.props.name || 'startdate'}
                selected={this.state.date}
                dateFormat='dd/MM/yyyy'
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChangeRaw={this.handleChangeRaw}
                isClearable={!this.props.readOnly || this.props.disabled}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
            />
        );
    }
}

DatePickerCustom.defaultProps = {
    name: '',
    dateFormat: 'dd/MM/yyyy',
    selectDate: {},
    value: null,
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
};

export default DatePickerCustom;
