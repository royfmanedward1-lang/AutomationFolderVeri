const getTimezonesQuery = `
query getTimezones {
  timezones {
    id
    displayName
    dstShortName
    enabled
    ianaTimeZones {
      id
      name
      __typename
    }
    stdShortName
    timeOffset
    __typename
  }
}
`;

module.exports = getTimezonesQuery;