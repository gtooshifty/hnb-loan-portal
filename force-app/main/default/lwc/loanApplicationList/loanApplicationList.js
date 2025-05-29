import { LightningElement, wire, track } from "lwc";
import getLoanApplications from "@salesforce/apex/LoanApplicationController.getLoanApplications";

const COLUMNS = [
  { label: "Name", fieldName: "Name" },
  { label: "Amount", fieldName: "Loan_Amount__c", type: "currency" },
  { label: "Status", fieldName: "Loan_Status__c" },
  { label: "Customer", fieldName: "Customer__rName" },
  { label: "Loan Officer", fieldName: "Loan_Officer__rName" }
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
    // We'll populate this dynamically once data loads
  ];

  @wire(getLoanApplications)
  wiredApps({ error, data }) {
    if (data) {
      this.applications = data.map((app) => ({
        ...app,
        Customer__rName: app.Customer__r?.Name,
        Loan_Officer__rName: app.Loan_Officer__r?.Name
      }));

      // Populate officer options dynamically based on data
      const officers = [
        ...new Set(
          this.applications
            .map((app) => app.Loan_Officer__rName)
            .filter(Boolean)
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
        (this.statusFilter === "" ||
          app.Loan_Status__c === this.statusFilter) &&
        (this.officerFilter === "" ||
          app.Loan_Officer__rName === this.officerFilter)
      );
    });
  }
}
