import moment from 'moment';
export function formatTime(date) {
    /**
     * Format the date and using local time
     */
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}