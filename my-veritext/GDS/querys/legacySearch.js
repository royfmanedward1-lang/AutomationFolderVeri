const legacySearchQuery = `
query legacySearch($after: String, $before: String, $filesType: [FileTypes!]!, $filters: [LegacySearchInput!]!, $includeCancelled: Boolean, $jobIds: [Int!], $match: LegacySearchMatch!) {
  legacySearch(
    after: $after
    before: $before
    filesType: $filesType
    filters: $filters
    includeCancelled: $includeCancelled
    jobIds: $jobIds
    match: $match
  ) {
    file {
      displayName
      name
      type {
        description
        __typename
      }
      ... on ExhibitFile {
        ...ExhibitFile
        job {
          ...LegacySearchJob
          __typename
        }
        __typename
      }
      ... on MiscFile {
        ...MiscFile
        job {
          ...LegacySearchJob
          __typename
        }
        __typename
      }
      ... on TranscriptFile {
        ...TranscriptFile
        job {
          ...LegacySearchJob
          __typename
        }
        __typename
      }
      ... on VideoZipFile {
        ...VideoZipFile
        job {
          ...LegacySearchJob
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}

fragment LegacySearchJob on Job {
  id
  defendant
  depositionDateWithOffset
  plaintiff
  attorney {
    id
    name
    __typename
  }
  case {
    name
    __typename
  }
  thirdParty {
    id
    name
    __typename
  }
  witnesses {
    name
    __typename
  }
  __typename
}

fragment ExhibitFile on ExhibitFile {
  id
  displayName
  exhibitName
  exhibitNumber
  lastUpdated
  name
  office {
    id
    name
    __typename
  }
  pageIntroducedOn
  qcStatus
  size
  type {
    ...FileType
    __typename
  }
  witness {
    ...Witness
    __typename
  }
  __typename
}

fragment FileType on FileType {
  id
  cloudServer
  description
  group
  lastUpdated
  name
  publicFileType
  showInMyVeritext
  __typename
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

fragment MiscFile on MiscFile {
  id
  dateAdded
  displayName
  name
  office {
    id
    name
    __typename
  }
  size
  type {
    ...FileType
    __typename
  }
  witness {
    ...Witness
    __typename
  }
  __typename
}

fragment TranscriptFile on TranscriptFile {
  id
  dateAdded
  displayName
  name
  office {
    id
    name
    __typename
  }
  size
  totalPages
  type {
    ...FileType
    __typename
  }
  witness {
    ...Witness
    __typename
  }
  __typename
}

fragment VideoZipFile on VideoZipFile {
  id
  dateAdded
  displayName
  name
  office {
    id
    name
    __typename
  }
  size
  type {
    ...FileType
    __typename
  }
  witness {
    ...Witness
    __typename
  }
  __typename
}`;

module.exports = legacySearchQuery;