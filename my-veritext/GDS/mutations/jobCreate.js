const jobCreate = `
mutation jobCreate($job: JobCreateInput!) {
  jobCreate(job: $job) {
    id
    division {
      office {
        id
        name
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

module.exports = jobCreate;