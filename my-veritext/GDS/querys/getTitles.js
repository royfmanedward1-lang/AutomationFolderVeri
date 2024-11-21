const getTitlesQuery = `
query titles {
  titles {
    ...Title
    __typename
  }
}

fragment Title on Title {
  id
  isAttorney
  isCaller
  title
  __typename
}
`;

module.exports = getTitlesQuery;