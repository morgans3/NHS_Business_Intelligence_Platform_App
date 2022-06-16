import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { iFullUser, iOrganisation, iTeam, APIService, UserSearchDialogComponent } from "diu-component-library";
import { Store } from "@ngxs/store";
import { NotificationService } from "../../../../_services/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { ReferenceState, UpdateTeams } from "../../../../_states/reference.state";

@Component({
    selector: "app-create-team",
    templateUrl: "./create-team.component.html",
    styleUrls: ["./create-team.component.scss"],
})
export class CreateTeamComponent implements OnInit {
    codevalid = true;
    responsiblepeople: string[] = [];
    organisations: iOrganisation[] = [];
    myForm = new FormGroup({
        name: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        code: new FormControl(null, Validators.required),
        organisationcode: new FormControl(null, Validators.required),
        id: new FormControl(null),
    });
    @ViewChild(FormGroupDirective, { static: false }) formDirective: FormGroupDirective;
    form: iTeam;
    existingteams: iTeam[] = [];

    constructor(
        private usergroupService: APIService,
        private notificationService: NotificationService,
        public store: Store,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.store.select(ReferenceState.getTeams).subscribe((res: iTeam[]) => {
            this.existingteams = res;
        });
        this.store.select(ReferenceState.getOrganisations).subscribe((res: iOrganisation[]) => {
            this.organisations = res;
        });
    }

    checkagainstTeams(code: string) {
        if (this.existingteams.filter((x) => x.code === code).length > 0) {
            this.codevalid = false;
        } else {
            this.codevalid = true;
        }
    }

    onSubmit() {
        if (this.existingteams.filter((x) => x.code === this.myForm.controls["code"].value).length > 0) {
            this.notificationService.warning("This Team Code already exists, please choose a unique team code.");
            return;
        }
        const team: iTeam = {
            id: "0",
            name: this.myForm.controls["name"].value,
            description: this.myForm.controls["description"].value,
            code: this.myForm.controls["code"].value,
            organisationcode: this.myForm.controls["organisationcode"].value,
            responsiblepeople: this.responsiblepeople,
        };
        this.usergroupService.createTeam(team).subscribe(() => {
            this.formDirective.resetForm();
            this.responsiblepeople = [];
            this.notificationService.success("Team has been created! Go to My Team page to begin adding members.");
            this.store.dispatch(UpdateTeams);
        });
    }

    removePerson(person: string) {
        this.responsiblepeople.splice(this.responsiblepeople.indexOf(person), 1);
    }

    findPeople() {
        const dialogRef = this.dialog.open(UserSearchDialogComponent, {
            width: "600px",
            data: null,
        });

        dialogRef.afterClosed().subscribe((result: iFullUser) => {
            if (result) {
                this.responsiblepeople.push(`${result.username}#${result.organisation}`);
            }
        });
    }
}
