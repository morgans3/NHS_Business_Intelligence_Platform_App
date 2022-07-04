import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { NotificationService } from "../../../../_services/notification.service";
import { iTeam, APIService } from "diu-component-library";
import { UpdateTeams } from "src/app/_states/reference.state";
import { Store } from "@ngxs/store";

@Component({
    selector: "app-team-admin",
    templateUrl: "./team-admin.component.html",
})
export class TeamAdminComponent implements OnInit, OnChanges {
    @Input() team: iTeam;
    teamUpdateForm = new FormGroup({
        id: new FormControl(null),
        code: new FormControl(""),
        name: new FormControl(""),
        description: new FormControl(""),
        organisationcode: new FormControl(""),
        responsiblepeople: new FormControl([]),
    });

    constructor(
        public store: Store,
        private apiService: APIService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges): void {
        this.teamUpdateForm.patchValue(this.team);
    }

    update() {
        // Update team
        this.apiService.updateTeam(this.teamUpdateForm.value).subscribe((data: any) => {
            if (data.success) {
                this.store.dispatch(UpdateTeams);
                this.notificationService.success("Team updated successfully!");
            } else {
                this.notificationService.error("An error occurred updating the team");
            }
        });
    }
}
