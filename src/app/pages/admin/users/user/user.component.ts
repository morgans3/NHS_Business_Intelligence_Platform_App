import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { APIService } from "diu-component-library";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  //User details
  user = {
    profile: {},
    roles: [{ name: "COVID-19 App", capabilities: ["outbreak_map", "shielding_service"], description: "Access COVID-19 app" }],
    capabilities: [{ name: "outbreak_map", description: "Access COVID-19 outbreak map", approved_by: "Stewart Morgan" }],
    teams: [],
    logs: [],
  };

  //Option lists
  teams = [];

  constructor(private activatedRoute: ActivatedRoute, private apiService: APIService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      //Get user's details
      this.apiService.getUserProfileByUsername(params.username).subscribe((user) => {
        this.user.profile = user;
      });

      //Get user's teams
      this.apiService.getTeamMembershipsByUsername(params.username).subscribe((teams: any) => {
        this.user.teams = teams;
      });
    });
  }

  role = {
    assign: (role) => {
      //Send request to assign role to user
      //Update clientside list of roles
      //Reset autocomplete box
    },
    remove: () => {},
  };

  capability = {
    assign: (role) => {
      //Send request to assign capability to user
      //Update clientside list of roles
      //Reset autocomplete box
    },
    remove: () => {},
  };

  team = {
    search: (name) => {
      this.apiService.searchTeamsByName(name).subscribe((teams: any) => {
        this.teams = teams;
        console.log(teams);
      });
    },
    assign: ($event) => {
      console.log($event);
      //Send request to assign role to user

      //Update clientside list of roles

      //Reset autocomplete box
    },
    remove: () => {},
  };
}
