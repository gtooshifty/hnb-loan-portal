public with sharing class LoanActivityController {
  @AuraEnabled(cacheable=true)
  public static List<Loan_Application__c> getRecentActivities() {
    return [
      SELECT Id, Name, Status__c, Applicant_Name__c, LastModifiedDate
      FROM Loan_Application__c
      ORDER BY LastModifiedDate DESC
      LIMIT 10
    ];
  }
}
