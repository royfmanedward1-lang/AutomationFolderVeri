const getHolidaysQuery = `
query getHolidays($holidayGroupId: Int!, $after: String!) {
  holidays(holidayGroupId: $holidayGroupId, after: $after) {
    id
    name
    date
    year
    isBankHoliday
    __typename
  }
}
`;

module.exports = getHolidaysQuery;