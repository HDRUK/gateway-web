const hourOptions = Array.from({ length: 24 })
    .map((v, index) => index)
    .map(hour => (hour.toString().length === 1 ? `0${hour}` : `${hour}`));

const minuteOptions = Array.from({ length: 60 })
    .map((v, index) => index)
    .map(min => (min.toString().length === 1 ? `0${min}` : `${min}`));

export { hourOptions, minuteOptions };
