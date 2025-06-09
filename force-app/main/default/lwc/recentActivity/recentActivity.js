import { LightningElement, wire, track } from "lwc";
import getRecentActivities from "@salesforce/apex/LoanActivityController.getRecentActivities";

export default class RecentActivity extends LightningElement {
  @track activities;
  @track error;

  @wire(getRecentActivities)
  wiredActivities({ error, data }) {
    if (data) {
      this.activities = data;
      this.error = undefined;
    } else if (error) {
      this.error = error.body ? error.body.message : error.message;
      this.activities = undefined;
    }
  }
}
