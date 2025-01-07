class JobClass {
    constructor({
      caseId,
      defendant,
      plaintiff,
      proceedingTypeId,
      thirdPartyId,
      divisionId,
      deliveryDays,
      timeZoneId,
      deliveryMethod,
      depositionDate,
      depositionEnd,
      locationId,
      locationTypeId,
      locationNotes,
      locationAddress1,
      locationAddress2,
      locationCity,
      locationName,
      locationState,
      locationZip,
      locationContactPhone,
      locationContact,
      hasDigitalReporter,
      hasTranscriber,
      hasCourtReporter,
      hasInterpreter,
      hasVideographer,
      notes,
      numberOfAttorneys,
      numberOfWitnesses,
      attorneyContactId,
      callerContactId,
      clientAddressId,
      clientId,
    }) {
      this.caseId = caseId;
      this.defendant = defendant;
      this.plaintiff = plaintiff;
      this.proceedingTypeId = proceedingTypeId;
      this.thirdPartyId = thirdPartyId;
      this.divisionId = divisionId;
      this.deliveryDays = deliveryDays;
      this.timeZoneId = timeZoneId;
      this.deliveryMethod = deliveryMethod;
      this.depositionDate = depositionDate;
      this.depositionEnd = depositionEnd;
      this.locationId = locationId;
      this.locationTypeId = locationTypeId;
      this.locationNotes = locationNotes;
      this.locationAddress1 = locationAddress1;
      this.locationAddress2 = locationAddress2;
      this.locationCity = locationCity;
      this.locationName = locationName;
      this.locationState = locationState;
      this.locationZip = locationZip;
      this.locationContactPhone = locationContactPhone;
      this.locationContact = locationContact;
      this.hasDigitalReporter = hasDigitalReporter;
      this.hasTranscriber = hasTranscriber;
      this.hasCourtReporter = hasCourtReporter;
      this.hasInterpreter = hasInterpreter;
      this.hasVideographer = hasVideographer;
      this.notes = notes;
      this.numberOfAttorneys = numberOfAttorneys;
      this.numberOfWitnesses = numberOfWitnesses;
      this.attorneyContactId = attorneyContactId;
      this.callerContactId = callerContactId;
      this.clientAddressId = clientAddressId;
      this.clientId = clientId;
    }
  
    generateQuery() {
      return `mutation jobCreate {
        jobCreate(job:{
          caseId: ${this.caseId},
          defendant: "${this.defendant}",
          plaintiff: "${this.plaintiff}",
          proceedingTypeId: ${this.proceedingTypeId},
          thirdPartyId: ${this.thirdPartyId},
          divisionId: ${this.divisionId},
          deliveryDays: ${this.deliveryDays},
          timeZoneId: ${this.timeZoneId},
          deliveryMethod: "${this.deliveryMethod}",
          depositionDate: "${this.depositionDate}",
          depositionEnd: "${this.depositionEnd}",
          locationId: ${this.locationId},
          locationTypeId: ${this.locationTypeId},
          locationNotes: "${this.locationNotes}",
          locationAddress1: "${this.locationAddress1}",
          locationAddress2: "${this.locationAddress2}",
          locationCity: "${this.locationCity}",
          locationName: "${this.locationName}",
          locationState: "${this.locationState}",
          locationZip: "${this.locationZip}",
          locationContactPhone: "${this.locationContactPhone}",
          locationContact: "${this.locationContact}",
          hasDigitalReporter: ${this.hasDigitalReporter},
          hasTranscriber: ${this.hasTranscriber},
          hasCourtReporter: ${this.hasCourtReporter},
          hasInterpreter: ${this.hasInterpreter},
          hasVideographer: ${this.hasVideographer},
          notes: "${this.notes}",
          numberOfAttorneys: "${this.numberOfAttorneys}",
          numberOfWitnesses: "${this.numberOfWitnesses}",
          attorneyContactId: ${this.attorneyContactId},
          callerContactId: ${this.callerContactId},
          clientAddressId: ${this.clientAddressId},
          clientId: ${this.clientId}
        }) {
          id
        }
      }`;
    }
  }
  
module.exports = JobClass;