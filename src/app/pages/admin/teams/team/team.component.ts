import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";
import { MatTable } from "@angular/material/table";
import { forkJoin } from "rxjs";
declare function cwr(operation: string, payload: any): void;

@Component({
  selector: "admin-team",
  templateUrl: "./team.component.html",
})
export class TeamComponent implements OnInit {
  @ViewChild("rolesTable") rolesTable: MatTable<any>;
  @ViewChild("capabilitiesTable") capabilitiesTable: MatTable<any>;

  team = new FormGroup({
    _id: new FormControl(null),
    code: new FormControl(""),
    name: new FormControl(""),
    description: new FormControl(""),
    organisationcode: new FormControl(""),
    responsiblepeople: new FormControl([]),
  });

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private apiService: APIService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        cwr("recordPageView", this.router.url);
      }
    });

    //Listen for id param
    this.activatedRoute.params.subscribe((params) => {
      if (params.id && params.id !== "new") {
        this.apiService.getTeams().subscribe((teams: any) => {
          //Get team and set value
          let team = teams.find((team) => {
            return team._id == params.id;
          });
          this.team.patchValue(team);

          //Get team capabilities
          this.apiService.getCapabilitiesByTypeId("team", team.code).subscribe((data: any) => {
            this.capabilities.selected = data instanceof Array ? data : [];
            this.capabilitiesTable.renderRows();
          });

          //Get team roles
          this.apiService.getRolesByTypeId("team", team.code).subscribe((data: any) => {
            this.roles.selected = data instanceof Array ? data : [];
            this.rolesTable.renderRows();
          });
        });
      }
    });
  }

  save() {
    //Roles and capabilities
    let rolesCapabiltiesUpdate = forkJoin({
      capabilities: this.apiService.syncCapabilityLinks(
        this.capabilities.selected.map((item) => item.id),
        "team",
        this.team.value.code
      ),
      roles: this.apiService.syncRoleLinks(
        this.roles.selected.map((item) => item.id),
        "team",
        this.team.value.code
      ),
    });

    //Create/Update team?
    if (this.team.value._id) {
      this.apiService.updateTeam(this.team.value).subscribe((data: any) => {
        if (data.success) {
          rolesCapabiltiesUpdate.subscribe((data: any) => {
            if (data.capabilities.success && data.roles.success) {
              this.notificationService.success("Team updated successfully!");
              this.router.navigateByUrl("/admin/teams");
            } else {
              this.notificationService.error("An error adding roles & capabilities to the team");
            }
          });
        } else {
          this.notificationService.error("An error occurred updating the team");
        }
      });
    } else {
      this.apiService.addTeam(this.team.value).subscribe((data: any) => {
        if (data.success) {
          rolesCapabiltiesUpdate.subscribe((data: any) => {
            if (data.capabilities.success && data.roles.success) {
              this.notificationService.success("Team created successfully!");
              this.router.navigateByUrl("/admin/teams");
            } else {
              this.notificationService.error("An error adding roles & capabilities to the team");
            }
          });
        } else {
          this.notificationService.error("An error occurred creating the team");
        }
      });
    }
  }

  update() {
    // TODO: implement function or update html onSubmit
  }

  roles = {
    list: { all: [], filtered: [] },
    selected: [],
    search: async (name = "") => {
      //Get roles list?
      if (this.roles.list.all.length == 0) {
        this.roles.list.all = (await this.apiService.getRoles().toPromise()) as any;
      }

      //Filter roles
      let selectedIds = this.roles.selected.map((item) => item.id);
      this.roles.list.filtered = this.roles.list.all.filter((item) => {
        return (item.name.toLowerCase() + item.description.toLowerCase()).includes(name.toLowerCase()) && !selectedIds.includes(item.id);
      });
    },
    assign: ($event, rolesSearchInput) => {
      //Add role
      this.roles.selected.push($event.option.value);
      this.rolesTable.renderRows();

      //Clear input
      rolesSearchInput.value = "";
      rolesSearchInput.blur();
    },
    revoke: (index) => {
      //Remove by index
      console.log(index);
      this.roles.selected.splice(index, 1);
      this.rolesTable.renderRows();
    },
  };

  capabilities = {
    list: { all: [], filtered: [] },
    selected: [],
    search: async (name = "") => {
      //Get roles list?
      if (this.capabilities.list.all.length == 0) {
        this.capabilities.list.all = (await this.apiService.getCapabilities().toPromise()) as any;
      }

      //Filter roles
      let selectedIds = this.capabilities.selected.map((item) => item.id);
      this.capabilities.list.filtered = this.capabilities.list.all.filter((item) => {
        return (item.name.toLowerCase() + item.description.toLowerCase()).includes(name.toLowerCase()) && !selectedIds.includes(item.id);
      });
    },
    assign: ($event, capabilitiesSearchInput) => {
      //Add role
      this.capabilities.selected.push($event.option.value);
      this.capabilitiesTable.renderRows();

      //Clear input
      capabilitiesSearchInput.value = "";
      capabilitiesSearchInput.blur();
    },
    revoke: (index) => {
      //Remove by index
      this.capabilities.selected.splice(index, 1);
      this.capabilitiesTable.renderRows();
    },
  };
}
