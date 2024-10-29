const setUserPassword = `
mutation setUserPassword($password: String!) {
  userSetPassword(password: $password)
}
`;

module.exports = setUserPassword;