import moment from 'moment';

const getCurrentDate = () => {
    return moment.utc(new Date()).format('YYYY-MM-DD HH:MM:SS');
}

export {
    getCurrentDate
}