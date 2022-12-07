import { Form, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import './Course.scss';
import Entries from './Entries';

const EntryFieldArray = ({ formik, remove, push, level }) => {
    return (
        <>
            {formik.values.entries.length > 0 &&
                formik.values.entries.map((p, indexC) => (
                    <>
                        <Col sm={5} className='pad-right-0 pad-bottom-4'>
                            <DropdownButton
                                data-test-id='entry-level'
                                variant='white'
                                title={formik.values.entries[indexC].level || <option disabled selected value />}
                                className='gray700-13 custom-dropdown padding-right-0'
                                onChange={formik.handleChange}
                                value={formik.values.entries[indexC].level}
                                onBlur={formik.handleBlur}
                                onSelect={selected => (formik.values.entries[indexC].level = selected)}>
                                {level.map((l, i) => (
                                    <Dropdown.Item data-test-id={`entry-level-${l}`} className='gray800-14 width-100' key={l} eventKey={l}>
                                        {l}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>
                        <Col sm={5} className='pad-right-0 pad-bottom-4'>
                            <div className=''>
                                <Form.Control
                                    data-test-id='entry-subject'
                                    id={`entries[${indexC}].subject`}
                                    name={`entries[${indexC}].subject`}
                                    type='text'
                                    className='smallFormInput addFormInput'
                                    onChange={formik.handleChange}
                                    value={formik.values.entries[indexC].subject}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </Col>

                        <Col style={{ paddingRight: '0px' }} sm={2} className='d-flex justify-content-center align-items-center setHeight'>
                            <button
                                type='button'
                                className='plusMinusButton'
                                disabled={formik.values.entries.length < 2}
                                onClick={() => {
                                    remove(indexC);
                                    formik.values.entries.splice(indexC, 1);
                                }}>
                                -
                            </button>
                            <button
                                type='button'
                                className='plusMinusButton'
                                disabled={formik.values.entries.length >= 5 || indexC !== formik.values.entries.length - 1}
                                onClick={() => {
                                    push(new Entries());
                                    formik.values.entries.push({
                                        level: '',
                                        subject: '',
                                    });
                                }}>
                                +
                            </button>
                        </Col>
                    </>
                ))}
        </>
    );
};

export default EntryFieldArray;
