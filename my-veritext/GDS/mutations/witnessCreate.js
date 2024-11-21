const witnessCreate = `
mutation witnessCreate($witness: CreateWitnessInput!) {
  witnessCreate(witness: $witness) {
    ...Witness
    __typename
  }
}

fragment Witness on Witness {
  id
  name
  firstName
  email
  expertise {
    id
    enabled
    name
    __typename
  }
  lastName
  middleName
  salutation
  startTime
  suffix
  appearanceOnly
  __typename
}
`;

module.exports = witnessCreate;