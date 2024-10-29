const getBuildingsQuery = `
query getBuildings {
  buildings {
    id
    name
    address {
      ...Address
      __typename
    }
    dateDisabled
    dateStarted
    isVirtual
    typeId
    __typename
  }
}

fragment Address on Address {
  id
  entity {
    id
    __typename
  }
  address1
  address2
  contact
  city
  state {
    id
    initials
    name
    __typename
  }
  country {
    id
    name
    __typename
  }
  zip
  __typename
}
`;

module.exports = getBuildingsQuery;