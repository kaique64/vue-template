export function validateDates(startDate: Date, endDate: Date) {
    return startDate < endDate && endDate > startDate;
}