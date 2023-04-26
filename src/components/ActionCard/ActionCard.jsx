import PropTypes from 'prop-types';
import { Box, Card, CardBody, H5 } from 'hdruk-react-core';

const ActionCard = ({ title, content, action, ...outerProps }) => (
    <Card {...outerProps}>
        <CardBody>
            <Box
                display={{
                    md: 'flex',
                }}
                gap={8}>
                <Box flexGrow='1'>
                    <H5 mb={1}>{title}</H5>
                    {content}
                </Box>
                {action && (
                    <Box
                        display={{
                            md: 'flex',
                        }}
                        justifyContent='flex-end'
                        alignItems='center'
                        flexBasis={{
                            md: '40%',
                        }}>
                        {action}
                    </Box>
                )}
            </Box>
        </CardBody>
    </Card>
);

ActionCard.propTypes = {
    title: PropTypes.node,
    action: PropTypes.node,
    content: PropTypes.node,
};

ActionCard.defaultProps = {
    title: null,
    content: null,
    action: null,
};

export default ActionCard;
