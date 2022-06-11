import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Store } from "@ngxs/store";
import { MatDialog } from "@angular/material/dialog";

import { iFullUser, iOrganisation, APIService } from "diu-component-library";
import { NotificationService } from "../../../_services/notification.service";
import { ReferenceState } from "../../../_states/reference.state";
import { iDisplayList, iInstallation } from "diu-component-library";
import { PasswordResetService } from "../../forms/password-reset/password-reset.service";

@Component({
    selector: "app-profile-details",
    templateUrl: "./details.component.html",
})
export class ProfileDetailsComponent implements OnInit, AfterViewInit {
    currentProfile: iFullUser;
    @Input() set user(user: iFullUser) {
        this.currentProfile = user;
        this.getInstallations();
    }
    @Output() formUpdated = new EventEmitter<boolean>();

    passwordExpired = false;
    updatedImage: any = null;
    myApplications: iInstallation[] = [];
    contactmethods = ["Email", "System Notification", "Phone"];

    form = new FormGroup({
        preferredcontactmethod: new FormControl([]),
        contactnumber: new FormControl(null),
    });

    displayLists: { title: string; data: iDisplayList[] }[] = [];
    myInstallations: iInstallation[] = [];

    constructor(
        public dialog: MatDialog,
        private apiService: APIService,
        private notificationService: NotificationService,
        private passwordResetService: PasswordResetService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private store: Store
    ) {}

    ngOnInit() {
        if (this.currentProfile) {
            this.form.patchValue({
                preferredcontactmethod: this.currentProfile.preferredcontactmethod || null,
                contactnumber: this.currentProfile.contactnumber || null,
            });
        } else {
            this.form.patchValue({
                preferredcontactmethod: null,
                contactnumber: null,
            });
        }
    }

    ngAfterViewInit() {
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params["action"]) {
                if (params["action"] === "change-password") {
                    this.passwordExpired = true;
                    this.changePassword();
                }
            }
        });
    }
    @ViewChild("changePasswordModal", { static: true }) changePasswordModal: TemplateRef<void>;
    changePassword() {
        this.store.select(ReferenceState.getOrganisations).subscribe((res: iOrganisation[]) => {
            if (res && res.length > 0) {
                const userOrganisation = res.find((item) => item.name === this.currentProfile.organisation);

                if (userOrganisation && userOrganisation.authmethod === "Demo") {
                    const dialog = this.dialog.open(this.changePasswordModal, {
                        disableClose: this.passwordExpired,
                    });
                    dialog.afterOpened().subscribe(() => {
                        this.passwordResetService.userSource.next({
                            username: this.currentProfile.username,
                            organisation: userOrganisation,
                            code: null,
                        });
                        const statusSubscription = this.passwordResetService.step.subscribe((step) => {
                            if (step === "complete") {
                                this.notificationService.success("Your password has been updated!");
                                this.router.navigateByUrl("/Profile");
                                this.passwordExpired = false;
                                dialog.close();
                                statusSubscription.unsubscribe();
                            }
                        });
                    });
                } else {
                    this.notificationService.warning("Please contact your IT support team to change your password");
                }
            }
        });
    }

    getInstallations() {
        // TODO: get installations
        // if (this.installbroker.getAllInstallations.length === 0) this.installbroker.buildUserData();
        // this.myInstallations = this.installbroker.getAllInstallations();
        // this.installbroker.createDisplayLists("user", (err: any, res: any) => {
        //   this.displayLists = res;
        // });
    }

    install(event: any, type: string) {
        console.log(event);
        console.log(type);
        // TODO: install
        // this.installbroker.addInstallation(
        //   event.name,
        //   type.toLowerCase(),
        //   (err: any, res: iInstallation[]) => {
        //     if (err) this.notificationService.warning(err);
        //     else {
        //       this.notificationService.success("Installed");
        //     }
        //     this.getInstallations();
        //   },
        //   this.currentProfile.username
        // );
    }

    remove(event: any, type: string) {
        console.log(event);
        console.log(type);
        const install = this.myInstallations.find((x) => x.app_name === event.name);
        if (install) {
            // TODO: remove
            // this.installbroker.removeInstallationFromAList(install, (err: any, res: iInstallation[]) => {
            //   this.getInstallations();
            //   if (err) this.notificationService.warning(err);
            //   else {
            //     this.notificationService.success("Request Updated");
            //     this.getInstallations();
            //   }
            // });
        }
    }

    onSubmit() {
        if (this.currentProfile && this.currentProfile.id) {
            const updatedProfile: iFullUser = {
                id: this.currentProfile.id,
                username: this.currentProfile.username,
                photobase64: this.currentProfile.photobase64,
                contactnumber: this.form.controls["contactnumber"].value,
                preferredcontactmethod: this.form.controls["preferredcontactmethod"].value,
                name: this.currentProfile.name,
                email: this.currentProfile.email,
                organisation: this.currentProfile.organisation,
            };
            this.apiService.updateUserProfiles(updatedProfile).subscribe((res: any) => {
                if (res.success) {
                    this.notificationService.success(res.msg);
                    this.formUpdated.emit(true);
                } else {
                    this.notificationService.warning(res.msg);
                }
            });
        } else {
            const newProfile: iFullUser = {
                id: "",
                username: this.currentProfile.username + "#" + this.currentProfile.organisation,
                photobase64: this.updatedImage,
                contactnumber: this.form.controls["contactnumber"].value,
                preferredcontactmethod: this.form.controls["preferredcontactmethod"].value,
                name: this.currentProfile.name,
                email: this.currentProfile.email,
                organisation: this.currentProfile.organisation,
            };
            this.apiService.addUserProfile(newProfile).subscribe((res: any) => {
                if (res.success) {
                    this.notificationService.success(res.msg);
                    this.currentProfile.id = res.id;
                    this.formUpdated.emit(true);
                } else {
                    this.notificationService.warning(res.msg);
                }
            });
        }
    }
}
