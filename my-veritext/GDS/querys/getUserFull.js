const getUserFullQuery = `
query getUserFull($id: Int!) {
  user(id: $id) {
    id
    username
    primaryEntity {
      name
      addresses {
        ...Address
        __typename
      }
      __typename
    }
    contacts {
      ...ContactFull
      __typename
    }
    locations {
      ...Location
      __typename
    }
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

fragment ContactFull on Contact {
  id
  name
  cases {
    ...CaseMetaInfo
    __typename
  }
  enabled
  entity {
    ...Entity
    __typename
  }
  hidden
  thirdPartyAssociations {
    thirdParty {
      id
      enabled
      name
      deleted
      customFields {
        id
        name
        required
        values {
          id
          enabled
          value
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}

fragment CaseMetaInfo on Case {
  id
  defendant
  enabled
  name
  plaintiff
  __typename
}

fragment Entity on Entity {
  id
  name
  addresses {
    ...Address
    __typename
  }
  deleted
  customFields {
    id
    name
    required
    values {
      id
      value
      enabled
      __typename
    }
    __typename
  }
  enabled
  attorneys {
    ...Contact
    __typename
  }
  callers {
    ...Contact
    __typename
  }
  __typename
}

fragment Contact on Contact {
  id
  enabled
  name
  firstName
  lastName
  title {
    ...Title
    __typename
  }
  emails {
    id
    email
    isPrimary
    __typename
  }
  __typename
}

fragment Title on Title {
  id
  isAttorney
  isCaller
  title
  __typename
}

fragment Location on UserLocation {
  id
  active
  address1
  address2
  city
  contactName
  name
  phone
  state
  zip
  __typename
}
`;

module.exports = getUserFullQuery;