import React from 'react';
import { useFormikContext } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SearchInput from '../SearchInput';
import SortDropdown from '../SortDropdown';
import useCommonStyles from '../../hooks/useCommonStyles';

const SearchControlsForm = ({ sortProps, inputProps, type, mt, mb, mr, ml, width, minWidth, maxWidth }) => {
    const { t } = useTranslation();
    const commonStyles = useCommonStyles({ mt, mb, mr, ml, width, minWidth, maxWidth });

    const { direction, value } = sortProps;

    const {
        submitForm,
        resetForm,
        values: { search, sortBy, sortDirection },
        values,
        setFieldValue,
    } = useFormikContext();

    const handleKeyDown = React.useCallback(e => {
        if (e.key === 'Enter') {
            if (inputProps.onKeyDownEnter) inputProps.onKeyDownEnter(submitForm);
        }
    }, []);

    const handleReset = React.useCallback(() => {
        resetForm();

        if (inputProps.onReset) inputProps.onReset(submitForm);
    }, [values]);

    const handleChange = React.useCallback(({ target: { name, value } }) => {
        setFieldValue(name, value);

        const { onChange } = inputProps;

        if (onChange) onChange(value);
    }, []);

    const handleOnSort = React.useCallback(
        criteria => {
            const { value, direction } = criteria;
            const { onSort } = sortProps;

            setFieldValue('sortBy', value);
            setFieldValue('sortDirection', direction);

            if (onSort) onSort(criteria, submitForm);
        },
        [values]
    );

    React.useEffect(() => {
        setFieldValue('sortBy', value);
        setFieldValue('sortDirection', direction);
    }, [value, direction]);

    return (
        <Row className={commonStyles}>
            <Col lg={6}>
                <SearchInput
                    placeholder={t('search.placeholder', { type: type.toLowerCase() })}
                    variant='primary'
                    {...inputProps}
                    value={search}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onReset={handleReset}
                />
            </Col>
            <Col lg={2} />
            {sortProps && (
                <Col lg={4} className='d-flex justify-content-end'>
                    <SortDropdown {...sortProps} onSort={handleOnSort} value={sortBy} direction={sortDirection} />
                </Col>
            )}
        </Row>
    );
};

export default SearchControlsForm;
