import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { collapseAnimations } from "../../../shared/animations";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../_states/auth.state";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { ReferenceState } from "../../../_states/reference.state";
import { decodeToken } from "src/app/_pipes/functions";
import { iTeam, iTeamMembers, APIService } from "diu-component-library";

@Component({
  selector: "app-team",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
  animations: [collapseAnimations],
  encapsulation: ViewEncapsulation.None,
})
export class TeamsComponent implements OnInit {
  tokenDecoded: any;
  openCloseAnim = "open";
  visible = true;
  currentTeam: iTeam;
  currentTeamMembers: iTeamMembers[];
  selectedteamcode: string;
  myTeams: iTeam[] = [];
  allTeams: iTeam[] = [];
  searchresults: iTeam[];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  isAdmin = false;
  isMember = false;

  constructor(public store: Store, private apiService: APIService, private router: Router, private route: ActivatedRoute) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      this.tokenDecoded = decodeToken(token);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.selectedteamcode = params.get("teamcode") || "";
      if (this.allTeams.length > 0) {
        this.changeTeamWithCode(this.selectedteamcode);
      }
    });
    this.getData();
  }

  getData() {
    this.allTeams = [];
    this.myTeams = [];
    this.currentTeamMembers = [];
    this.store.select(ReferenceState.getTeams).subscribe((res: iTeam[]) => {
      this.allTeams = res || [];
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );
      if (this.selectedteamcode) {
        this.changeTeamWithCode(this.selectedteamcode);
      }
    });
    if (this.tokenDecoded && this.tokenDecoded.username) {
      this.apiService.getTeamMembershipsByUsername(this.tokenDecoded.username).subscribe((res: any) => {
        if (res.length > 0) {
          res.forEach((memberships: any) => {
            this.addtoMyTeams(memberships.teamcode);
          });
        }
      });
    }
  }

  addtoMyTeams(teamcode: string) {
    const res = this.allTeams.filter((x) => x.code === teamcode);
    if (res.length > 0) {
      this.myTeams.push(res[0]);
    }
  }

  onCollapse() {
    this.openCloseAnim = this.openCloseAnim === "open" ? "close" : "open";
    if (this.openCloseAnim === "open") {
      setTimeout(() => (this.visible = true), 600);
    } else {
      this.visible = false;
    }
  }

  createTeam() {
    this.router.navigate(["/teams/create-team"]);
  }

  checkAdmin(admins: string[], username: string) {
    if (admins.includes(username)) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  checkMembership(members: iTeamMembers[], username: string) {
    if (members.find((x) => x.username === username)) {
      this.isMember = true;
    } else {
      this.isMember = false;
    }
  }

  changeTeam(team: iTeam) {
    this.currentTeam = team;
    this.currentTeamMembers = [];
    this.checkAdmin(this.currentTeam.responsiblepeople, this.tokenDecoded.username);
    this.apiService.getTeamMembersByCode(this.currentTeam.code).subscribe((res: any) => {
      this.currentTeamMembers = res;
      this.checkMembership(this.currentTeamMembers, this.tokenDecoded.username);
    });
    this.onCollapse();
  }

  changeTeamWithName(teamname: string) {
    this.currentTeam = this.allTeams.filter((x) => x.name === teamname)[0];
    this.currentTeamMembers = [];
    this.checkAdmin(this.currentTeam.responsiblepeople, this.tokenDecoded.username);
    this.apiService.getTeamMembersByCode(this.currentTeam.code).subscribe((res: any) => {
      this.currentTeamMembers = res;
      this.checkMembership(this.currentTeamMembers, this.tokenDecoded.username);
    });
    this.onCollapse();
  }

  changeTeamWithCode(teamcode: string) {
    this.currentTeam = this.allTeams.filter((x) => x.code === teamcode)[0];
    this.currentTeamMembers = [];
    this.checkAdmin(this.currentTeam.responsiblepeople, this.tokenDecoded.username);
    this.apiService.getTeamMembersByCode(this.currentTeam.code).subscribe((res: any) => {
      this.currentTeamMembers = res;
      this.checkMembership(this.currentTeamMembers, this.tokenDecoded.username);
    });
    this.onCollapse();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTeams.filter((option) => option.name.toLowerCase().includes(filterValue)).map((val) => val.name);
  }

  tabClick(tab: any) {
    if (tab.tab.textLabel === "Team Stats") {
      // console.log("Redraw Screen");
    }
  }

  inTeam(teamname) {
    let currentTeam = this.allTeams.filter((x) => x.name === teamname)[0];
    let blnShow = false;
    if (this.myTeams) {
      this.myTeams.forEach((team) => {
        if (team.code == currentTeam.code) {
          blnShow = true;
        }
      });
    }
    return blnShow;
  }
}
