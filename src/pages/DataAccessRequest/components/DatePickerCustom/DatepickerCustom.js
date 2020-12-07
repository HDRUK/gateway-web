import React from "react";
import DatePicker from "react-datepicker";
import moment from 'moment';
import { isNil, isEmpty } from 'lodash';
import "react-datepicker/dist/react-datepicker.css";

class DatePickerCustom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: isNil(this.props.value) || isEmpty(this.props.value) ? new Date() : moment(this.props.value, 'DD/MM/YYYY').toDate()
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(e) {
    let date = '';
    if(e) {
      date = e;
    }

    this.setState({
      date,
    }, this.props.onChange.bind(null, moment(date).format('DD/MM/YYYY')));
  }

  handleFocus(e) {
    this.props.onFocus();
  }

  handleBlur(e) {
    this.props.onBlur(this.props.value);
  }

  render() {
    return (
        <DatePicker
            disabled={this.props.readOnly || false}
            name={this.props.name || 'startdate'}
            selected={this.state.date}
            dateFormat="dd/MM/yyyy"
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
      />
    );
  }
}

DatePickerCustom.defaultProps = {
  name: '',
  dateFormat: 'dd/MM/yyyy',
  selectDate: {},
  value: '',
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

export default DatePickerCustom;
