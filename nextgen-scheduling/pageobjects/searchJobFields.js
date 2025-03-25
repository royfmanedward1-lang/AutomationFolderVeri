import { expect} from "@playwright/test";
import clientData  from '../testdata/clientData.json'
import exp from "constants";
const nextGenConfig = require('../nextgen.config');



export class Job {

   constructor(page){
        this.page = page
        //    LOCATORS
        // Proceeding Date
        this.proceedingDateField =  page.locator('#proceedingDate');
        this.proceedingDateInput =  page.getByLabel('Proceeding Date *');
        this.proceedingDateSelect =  page.getByLabel('Choose date, selected date is');
        // Proceeding Time
        this.proceedingStartTime = page.getByLabel('Start Time');
        this.proceedingEndTime = page.getByLabel('End time', { exact: true });
        this.proceedingEndTimeCheckbox = page.getByLabel('End time N/A');
        // Due date
        this.dueDate = page.getByLabel('Due Date *');
        // Number of Attendees
        this.numberOfAttendees = page.locator('#numberOfAttendees').getByRole('spinbutton');
        // Delivery Days
        this.deliveryDays = page.locator('#deliveryDays').getByRole('spinbutton');
        // End time checkbox
        this.endTimeCheck = this.page.getByLabel('End time N/A');
        // Languaje combo box
        this.languajeText = this.page.getByTestId('language-textField').locator('div');
        this.languajeInput = this.page.getByTestId('language-textField-input');
        // Publish job button
        this.publishButton = this.page.getByRole('button', { name: 'PUBLISH JOB' });


        // Generic locator for combobox and checkicon fields
        this.fields = (text) => page.locator(`#${text}`).getByRole('combobox');
        this.checkIcon = (text) => page.locator(`#${text}`).getByTestId('CheckIcon');
        
        // Generic locator for Attending parties fields
        this.inputFields = (text) => page.locator(`#${text}`).getByRole('spinbutton');

        // Generic locator for Textbox (as in Witness pop up fields)
        this.textFields = (text) => page.locator(`#${text}`).getByRole('textbox');
        
   }

   async verifyDefaultvalues (locatorField, defaultValue){
      expect(this.fields(locatorField)).toHaveText(defaultValue);

   }

   async selectMethod (method){
      await this.page.getByText('Phone').click();
      await this.page.getByRole('option', { name: method, exact: true }).click();
   }
   async verifyLocationTypeRadioValues (){

      for (const locType in nextgenConfig.locationTypes){
         await expect(this.page.getByRole('radiogroup')).toContainText(nextgenConfig.locationTypes[locType]);
      }
      
   }

   async selectLocationType (locationType, locatorField){
      const i = 0
      
      await this.page.getByLabel(locationType, { exact: true }).check();
      
      
      if(locationType === "Veritext" || locationType === "Remote"){
         await this.fields(locatorField).click()
         switch (locationType){
         case "Veritext":
            await this.page.getByText(clientData[i].veritextLocationName, { exact: true }).click();
            break;
         case "Remote":
            await this.page.getByText(clientData[i].remoteLocationName, { exact: true }).click();
               break;
         }
         await expect(this.checkIcon(locatorField)).toBeVisible();
         await expect(this.fields('locationAddress')).not.toBeEmpty();
         await expect(this.checkIcon('locationAddress')).toBeVisible();
      } else if(locationType === "Client"){
         await this.fields(locatorField).click();
         await expect(this.fields('locationClientName')).toHaveValue(clientData[i].clientName);
         await expect(this.checkIcon(locatorField)).toBeVisible();
         await expect(this.fields('locationAddress')).not.toBeEmpty();
         await expect(this.checkIcon('locationAddress')).toBeVisible();
      } else if(locationType === 'Other'){
         await this.fields(locatorField).fill(clientData[i].otherLocationName);
         await this.page.getByText(clientData[i].otherLocationName).click();
      } else if(locationType === "TBD"){
         await expect(this.fields('locationClientName')).not.toBeEnabled();
         await expect(this.fields('locationAddress')).not.toBeEnabled();
      }
      
   }

   async selectTimezone(timezone){
      const timezoneValue = await this.fields('timezone').inputValue();
      if(timezoneValue === ''){
         await this.fields('timezone').click();
         await this.fields('timezone').fill(timezone);
         await this.page.getByText(timezone).nth(0).click();
         await expect(this.checkIcon('timezone')).toBeVisible();
      } else {
         await expect(this.fields('timezone')).not.toBeEmpty();
         await expect(this.checkIcon('timezone')).toBeVisible();
      }
   }

   async verifyTimeZoneIsSelected(){
      await expect(this.fields('timezone')).not.toBeEmpty();
      await expect(this.checkIcon('timezone')).toBeVisible();
   }

   async selectDate(locatorField, selectedDate){
      await this.page.getByLabel(locatorField).fill(selectedDate);
      await expect(this.page.getByLabel(locatorField)).toHaveValue(selectedDate);
   }

   async selectProceedingTime(locatorField, exactMatch, selectedTime){
         await this.page.getByLabel(locatorField, {exact: exactMatch}).fill(selectedTime);
         await expect(this.page.getByLabel(locatorField, {exact: exactMatch})).toHaveValue(selectedTime);
      
   }

   async enterNumberAttendees(numberOfAttendees){
      await this.numberOfAttendees.click();
      await this.numberOfAttendees.fill(numberOfAttendees);
      await expect(this.numberOfAttendees).toHaveValue(numberOfAttendees);
   }

   async enterNumberAttendeesParties(locatorfield, numberOfAttendees){
      await this.inputFields(locatorfield).click();
      await this.inputFields(locatorfield).fill(numberOfAttendees);
      await expect(this.inputFields(locatorfield)).toHaveValue(numberOfAttendees);
   }

   async verifyDefaultValuePartnerService(){
      await expect(this.page.getByLabel(nextGenConfig.defaultValuePartnerService)).toBeChecked();
   }

   async verifydefaultValueDeliveyDays(){
      await expect(this.deliveryDays).toHaveValue(nextGenConfig.deliveryDaysDefaulValue);
   }

   async enterTextValues(locatorfield, textValue){
      await this.textFields(locatorfield).click();
      await this.textFields(locatorfield).fill(textValue);
      await expect(this.textFields(locatorfield)).toHaveValue(textValue);
   }

   async selectWitnessType(typeWit, expertise){
      await this.page.getByRole('combobox').nth(1).click();
      await this.page.getByRole('option', { name: typeWit }).locator('span').first().click();

      if(typeWit == 'Expert'){
         await this.page.getByLabel('Expertise').click();
         await this.page.getByText(expertise).click();
      }
      
   }

   async openWitnessPopup(){
      await this.page.getByRole('button', { name: 'Add Witnesses' }).click();
      await expect(this.page.getByText('Add Witness', { exact: true })).toBeVisible();
   }

   async closeWitnessPopup(lastname){
      await this.page.getByRole('button', { name: 'Add' }).click();
      await expect(this.page.getByRole('cell', { name: lastname, exact: true })).toBeVisible();
   }

   async publishJob(){
      await this.publishButton.click()
      const str = await this.page.getByText('Publishing has updated the').textContent();
      await expect(this.page.locator('body')).toContainText(nextGenConfig.publishSuccesfulText);

      const numberPattern = /\d+/g
      const jobID = str.match(numberPattern)
      console.log(jobID);
      
   }

   async searchSimilarJobs(){
      await expect(this.page.getByRole('button', { name: 'View Similar Jobs' })).toBeVisible();
      await this.page.getByRole('button', { name: 'View Similar Jobs' }).click();
      await expect(this.page.getByText('Job Information Entered')).toBeVisible();  
   }

   async reviewSimilarJobsHeader(searchValue){
      await expect(this.page.getByLabel(searchValue).getByText(searchValue)).toBeVisible(); 
   }

   async verifyColumnsSimilarJobSearch(){
      for (const column of nextGenConfig.similarJobColumnsSet1){
         await expect(this.page.getByText(column, { exact: true })).toBeVisible();
      }
      for (const columnS2 of nextGenConfig.similarJobColumnsSet2){
         await expect(this.page.locator('span').filter({ hasText: columnS2 }).last()).toBeVisible(); 
      }
   }

   async verifySimilarJobResults(expectedValue, row){
     await expect(this.page.getByText(expectedValue, {exact: true}).first()).toBeVisible();

   }

   async selectPartnerServices(expectedValue, languaje){
      await this.page.getByText(expectedValue).click();
      await expect(this.page.getByLabel(expectedValue)).toBeChecked();
      if(expectedValue == 'Interpreting'){
          await expect(this.languajeText).toBeVisible();
          await this.languajeInput.click();
          await this.languajeInput.fill(languaje);
          await this.page.getByText(languaje).click();
          await expect(this.page.getByTestId('language-textField').getByTestId('CheckIcon')).toBeVisible();
      } else if(expectedValue == 'Digital Reporting'){
         await expect(this.page.getByLabel('Transcription')).toBeChecked(); 
      }
   }
}