import moment from 'moment';

const getCurrentDate = () => {
    return moment.utc(new Date()).local().format('YYYY-MM-DD HH:MM:SS');
}

export {
    getCurrentDate
}