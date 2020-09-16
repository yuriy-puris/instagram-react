import { parseISO, isThisYear, formatDistanceStrict } from 'date-fns';

export function formatPostDate(date) {
    // MARCH 19
    const formatShort = parseISO(new Date(date), 'MMMM d');
    // FEBRUARY 2, 2019
    const formatLong = parseISO(new Date(date), 'MMMM d, yyy');
    
    return isThisYear(new Date(date) ? formatShort : formatLong);
};

export function formatDateToNowShort(date) {
    formatDistanceStrict(new Date(date), new Date(Date.now()))
        .split(' ')
        .map((s, i) => i === 1 ? s[0] : s)
        .join('')
}