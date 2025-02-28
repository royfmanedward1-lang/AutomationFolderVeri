class PartnerInfoClass {
    constructor({
      jobId,
      vendorId,
      serviceTypeIds,
      VPZIds
    }) {
      this.jobId = jobId;
      this.vendorId = vendorId;
      this.serviceTypeIds = serviceTypeIds;
      this.VPZIds = VPZIds;
    }
  
    generateQueryByJob() {
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

    generateQueryPartner() {
      return `query vendorVPZ {
        vendor (id: ${this.vendorId}) {
          name
          vpzs {
            id
          }
        }
      }`
    }
}

module.exports = PartnerInfoClass;