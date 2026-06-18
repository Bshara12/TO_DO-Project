export function atSameDay(Date1, Date2) {
    return (Date1.getFullYear() === Date2.getFullYear() &&
        Date1.getMonth() === Date2.getMonth() &&
        Date1.getDate() === Date2.getDate());
}
export function isToday(date) {
    return date.toDateString() === new Date().toDateString();
}
export function isUpcoming(Date1) {
    return Date1.getTime() > Date.now();
}
export function formatDate(Date1) {
    if (isToday(Date1)) {
        return 'today';
    }
    if (isYesterday(Date1)) {
        return 'yesterday';
    }
    return `${Date1.toLocaleDateString('en-gb', {
        day: 'numeric',
        month: 'long'
    })}`;
}
export function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
}
//# sourceMappingURL=dateHelper.js.map