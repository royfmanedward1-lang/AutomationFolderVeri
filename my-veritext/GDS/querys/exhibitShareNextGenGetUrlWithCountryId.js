const exhibitShareNextGenGetUrlWithCountryId = `
query exhibitShareNextGenGetUrlWithCountryId($userId: String!, $countryId: String!) {
  exhibitShareNextGenGetUrl(userId: $userId, countryId: $countryId)
}
`;

module.exports = exhibitShareNextGenGetUrlWithCountryId;