class PartnerInfoClass {
    constructor({
      jobId,
      serviceTypeIds,
      VPZIds
    }) {
      this.jobId = jobId;
      this.serviceTypeIds = serviceTypeIds;
      this.VPZIds = VPZIds;
    }
  
    generateQuery() {
      return `query getVendors {
      vendorsByJobId (
        jobId: ${this.jobId},
        serviceTypeIds: [${this.serviceTypeIds}],
        VPZIds: [${this.VPZIds}],
        ){
          available
          vendor {
            id
          }
        }
      }`
    }
}

module.exports = PartnerInfoClass;