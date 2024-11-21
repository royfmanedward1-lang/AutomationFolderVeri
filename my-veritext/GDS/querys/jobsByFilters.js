const jobsByFiltersQuery = `
query jobsByFilters($filters: JobsByFiltersInput!) {
  jobsByFilters(filters: $filters) {
    ... on JobResult {
      jobs {
        ...JobMetaInfo
        files {
          ...File
          ... on ExhibitFile {
            ...ExhibitFile
            __typename
          }
          ... on MiscFile {
            ...MiscFile
            __typename
          }
          ... on TranscriptFile {
            ...TranscriptFile
            __typename
          }
          __typename
        }
        services {
          ...Service
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
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

fragment File on File {
  id
  dateAdded
  displayName
  name
  size
  type {
    ...FileType
    __typename
  }
  office {
    id
    __typename
  }
  __typename
}

fragment JobMetaInfo on Job {
  attendees {
    id
    email
    firmName
    represents
    __typename
  }
  attorney {
    ...Contact
    entity {
      id
      __typename
    }
    __typename
  }
  caller {
    ...Contact
    entity {
      id
      __typename
    }
    phone
    __typename
  }
  client {
    id
    name
    __typename
  }
  id
  caption
  case {
    ...CaseMetaInfo
    __typename
  }
  country {
    id
    name
    __typename
  }
  defendant
  deliveryDays
  depositionDate
  depositionDateWithOffset
  hasCourtReporter
  hasDigitalReporter
  hasInterpreter
  hasTranscriber
  hasVideographer
  language
  locationAddress1
  locationAddress2
  locationCity
  locationName
  locationState
  locationZip
  plaintiff
  permissions {
    securityRule
    __typename
  }
  roomBooking {
    metadata {
      zoom {
        meeting {
          id
          joinUrl
          h323Password
          password
          sipHost
          startTime
          settings {
            globalDialInNumbers {
              country
              number
              type
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
    __typename
  }
  services {
    ...Service
    __typename
  }
  status
  timezone {
    ...Timezone
    __typename
  }
  witnesses {
    ...Witness
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

fragment Service on Service {
  id
  name
  __typename
}

fragment Timezone on Timezone {
  id
  displayName
  ianaTimeZones {
    ...IANATimeZone
    __typename
  }
  __typename
}

fragment IANATimeZone on IANATimeZone {
  id
  name
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
`;

module.exports = jobsByFiltersQuery;