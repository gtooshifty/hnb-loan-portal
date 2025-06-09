public with sharing class LoanApplicationController {
  @AuraEnabled(cacheable=true)
  public static List<Loan_Application__c> getLoanApplications() {
    return [
      SELECT
        Id,
        Name,
        Loan_Amount__c,
        Status__c,
        Customer__r.Name,
        Applicant_Name__c,
        Application_Date__c
      FROM Loan_Application__c
      ORDER BY CreatedDate DESC
    ];
  }
}
