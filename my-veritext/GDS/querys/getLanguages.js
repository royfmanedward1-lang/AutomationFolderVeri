const getLanguagesQuery = `
query GetLanguages {
  languages {
    id
    name
    __typename
  }
}
`;

module.exports = getLanguagesQuery;