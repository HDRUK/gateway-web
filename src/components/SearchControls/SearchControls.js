import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { Box } from 'hdruk-react-core';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import SearchControlsForm from './SearchControlsForm';

const SearchControls = ({
    onSubmit,
    isLoading,
    sortProps,
    inputProps,
    formRef,
    enableReinitialize,
    mt,
    mb,
    ml,
    mr,
    width,
    minWidth,
    maxWidth,
    ...outerProps
}) => {
    if (isLoading) return null;

    return (
        <Box {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}>
            <Formik
                initialValues={{
                    search: inputProps && !!inputProps.value ? inputProps.value : '',
                    sortBy: sortProps && !!sortProps.value ? sortProps.value : '',
                    sortDirection: sortProps && !!sortProps.direction ? sortProps.direction : '',
                }}
                onSubmit={onSubmit}
                innerRef={formRef}
                enableReinitialize={enableReinitialize}>
                <SearchControlsForm sortProps={sortProps} inputProps={inputProps} {...outerProps} />
            </Formik>
        </Box>
    );
};

SearchControls.propTypes = {
    onSubmit: PropTypes.func,
    ...PROP_TYPES_LAYOUTBOX,
};

SearchControls.defaultProps = {
    enableReinitialize: false,
};

export default SearchControls;
