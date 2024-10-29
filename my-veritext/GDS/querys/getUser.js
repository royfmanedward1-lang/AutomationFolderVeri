const getUserQuery = `
query getUser($userId: Int!) {
  user(id: $userId) {
    id
    firstName
    lastName
    username
  }
}`;

module.exports = getUserQuery;