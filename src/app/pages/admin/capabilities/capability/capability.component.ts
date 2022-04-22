import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators, ValidationErrors } from "@angular/forms";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
  selector: "admin-capability-edit",
  templateUrl: "./capability.component.html",
})
export class CapabilityComponent implements OnInit {
  capability = new FormGroup({
    id: new FormControl(null),
    name: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    authoriser: new FormControl("", Validators.required),
    tags: new FormControl([]),
    value: new FormControl("{}", (formControl: FormControl): ValidationErrors => {
      try {
        //Check for valid json
        JSON.parse(formControl.value);
      } catch (e) {
        return { invalid_json: true };
      }
      return null;
    }),
  });

  constructor(private router: Router, private apiService: APIService, private activatedRoute: ActivatedRoute, private notificationService: NotificationService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params.id && params.id !== "new") {
        this.apiService.getCapabilityById(params.id).subscribe((capability: any) => {
          //Set values
          this.capability.patchValue(
            Object.assign(capability, {
              value: JSON.stringify(capability.value),
            })
          );
        });
      }
    });
  }

  save() {
    if (this.capability.valid) {
      //Create or update?
      let method;
      if (this.capability.value.id) {
        method = this.apiService.updateCapability(this.capability.value);
      } else {
        method = this.apiService.createCapability(this.capability.value);
      }

      //Make request
      method.subscribe((res: any) => {
        if (res.success == true) {
          this.notificationService.success(`Capability ${this.capability.value.id ? "updated" : "created"}  successfully`);
          this.router.navigateByUrl("/admin/capabilities");
        } else {
          this.notificationService.error(res.msg || "An error occurred!");
        }
      });
    } else {
      this.notificationService.error("Please make sure all required fields are filled in correctly!");
    }
  }
}
