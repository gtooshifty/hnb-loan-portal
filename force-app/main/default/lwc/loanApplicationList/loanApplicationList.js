import { LightningElement, wire, track } from "lwc";
import getLoanApplications from "@salesforce/apex/LoanApplicationController.getLoanApplications";

const COLUMNS = [
  { label: "Applicant Name", fieldName: "ApplicantName" },
  { label: "Name", fieldName: "Name" },
  { label: "Amount", fieldName: "Loan_Amount__c", type: "currency" },
  { label: "Status", fieldName: "Status__c" },
  { label: "Application Date", fieldName: "ApplicationDate", type: "date" }
];

export default class LoanApplicationList extends LightningElement {
  @track applications = [];
  @track filteredApplications = [];
  @track statusFilter = "";
  @track officerFilter = "";

  columns = COLUMNS;

  statusOptions = [
    { label: "All", value: "" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" }
  ];

  officerOptions = [
    { label: "All", value: "" }
    // dynamically populated later
  ];

  @wire(getLoanApplications)
  wiredApps({ error, data }) {
    if (data) {
      this.applications = data.map((app) => ({
        ...app,
        CustomerName: app.Customer__r?.Name || "",
        LoanOfficerName: app.Loan_Officer__r?.Name || "",
        ApplicantName: app.Applicant_Name__c || "",
        ApplicationDate: app.Application_Date__c || null
      }));

      // Populate officer options dynamically based on data
      const officers = [
        ...new Set(
          this.applications.map((app) => app.LoanOfficerName).filter(Boolean)
        )
      ];
      this.officerOptions = [
        { label: "All", value: "" },
        ...officers.map((name) => ({ label: name, value: name }))
      ];

      this.applyFilters();
    } else if (error) {
      console.error(error);
    }
  }

  handleStatusChange(event) {
    this.statusFilter = event.detail.value;
    this.applyFilters();
  }

  handleOfficerChange(event) {
    this.officerFilter = event.detail.value;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredApplications = this.applications.filter((app) => {
      return (
        (this.statusFilter === "" || app.Status__c === this.statusFilter) &&
        (this.officerFilter === "" ||
          app.LoanOfficerName === this.officerFilter)
      );
    });
  }
}
