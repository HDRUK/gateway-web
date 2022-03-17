import moment from 'moment';

const _buildCompletionWheels = completionObj => {
    Object.keys(completionObj).forEach((section, completion) => {
        console.log(section);
        console.log(completion);
    });
};

const _calculateTimeDifference = startTime => {
    const start = moment(startTime);
    const end = moment();
    return end.diff(start, 'days');
};

export default {
    calculateTimeDifference: _calculateTimeDifference,
    buildCompletionWheels: _buildCompletionWheels,
};
