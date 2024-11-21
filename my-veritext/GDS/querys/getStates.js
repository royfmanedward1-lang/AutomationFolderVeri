const getStatesQuery = `
query getStates {
  states {
    id
    name
    initials
    country {
      id
      name
      __typename
    }
    __typename
  }
}
`;

module.exports = getStatesQuery;