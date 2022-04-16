import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MFAAuthService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "admin-role-edit",
    templateUrl: "./role.component.html",
    styleUrls: ["./role.component.scss"]
})
export class RoleComponent implements OnInit {

    capabilities = [];
    role = new FormGroup({
        id: new FormControl(null),
        name: new FormControl("", Validators.required),
        description: new FormControl("", Validators.required),
        authoriser: new FormControl("", Validators.required),
        capabilities: new FormControl([], Validators.required),
    });

    constructor(
        private router: Router,
        private authService: MFAAuthService,
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        //Listen for id param
        this.activatedRoute.params.subscribe((params) => {
            if (params.id && params.id !== 'new') {
                this.authService.getRoleById(params.id).subscribe((role: any) => {
                    //Set values
                    this.role.patchValue(Object.assign(role, {
                        value: JSON.stringify(role.value)
                    }));
                })
            }
        });

        //Get list of capabilities
        this.searchCapabilities();
    }

    save() {
        if (this.role.valid) {
            //Create or update?
            let method;
            if (this.role.value.id) {
                method = this.authService.updateRole(this.role.value);
            } else {
                method = this.authService.createRole(this.role.value);
            }

            //Make request
            method.subscribe((res: any) => {
                if (res.success == true) {
                    this.notificationService.success(`Role ${this.role.value.id ? 'updated' : 'created'}  successfully`);
                    this.router.navigateByUrl('/admin/roles');
                } else {
                    this.notificationService.error(res.msg || "An error occurred!");
                }
            });
        } else {
            this.notificationService.error("Please make sure all required fields are filled in correctly!");
        }
    }

    searchCapabilities(name = null) {
        //Get list of capabilities
        this.authService.getCapabilities().subscribe((capabilities: any) => {
            if (!name) {
                this.capabilities = capabilities;
            } else {
                this.capabilities = capabilities.filter((item) => {
                    return (item.name.toLowerCase() + item.description.toLowerCase()).includes(name.toLowerCase());
                })
            }
        });
    }

}