const getExpertisesPortalQuery = `
query getExpertises_Portal {
  expertises {
    ...Expertise
    __typename
  }
}

fragment Expertise on Expertise {
  id
  name
  shortName
  __typename
}
`;

module.exports = getExpertisesPortalQuery;