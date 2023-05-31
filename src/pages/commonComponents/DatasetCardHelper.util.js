import moment from 'moment';

const calculateTimeDifference = startTime => {
    const start = moment(startTime);
    const end = moment();
    return end.diff(start, 'days');
};

export { calculateTimeDifference };
