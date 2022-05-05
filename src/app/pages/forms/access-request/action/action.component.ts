import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../../../../_services/notification.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { APIService } from "diu-component-library";
declare function cwr(operation: string, payload: any): void;

@Component({
  selector: "app-access-request-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"],
})
export class AccessRequestActionFormComponent implements OnInit {
  request: any = {};
  action = "approve";

  constructor(private activatedRoute: ActivatedRoute, private notificationService: NotificationService, private apiService: APIService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        cwr("recordPageView", this.router.url);
      }
    });
    //Listen for request id
    this.activatedRoute.queryParams.subscribe((params) => {
      //Set parent request id
      this.getRequest(params["id"] || null);

      //Listen for request action
      this.activatedRoute.params.subscribe((params) => {
        if (params["action"]) {
          this.action = params["action"];
        }
      });
    });
  }

  getRequest(id) {
    this.apiService.getAccessRequest(id).subscribe((request) => {
      this.request = request;
    });
  }

  submit(form) {
    if (form.valid) {
      //Create form object
      let actionData: any = {
        parent_id: this.request.id,
        action: this.action,
        date: new Date().toISOString(),
      };

      //Set form properties
      if (this.action == "approve") {
        actionData = Object.assign(actionData, {
          officer: form.value.officer,
          officer_job: form.value.officer_job,
          organisation: form.value.organisation,
        });
      } else {
        actionData.reason = form.value.reason;
      }

      //Submit form
      this.apiService.sendAccessRequestComplete(actionData).subscribe((data) => {
        //Set status
        this.request.data.approved = this.action == "approve" ? true : false;
      });
    } else {
      this.notificationService.error("Please make sure all fields are filled in correctly!");
    }
  }
}
