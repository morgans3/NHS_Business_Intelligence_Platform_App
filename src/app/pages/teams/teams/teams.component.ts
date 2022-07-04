import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { collapseAnimations } from "../../../shared/animations";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../_states/auth.state";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { ReferenceState } from "../../../_states/reference.state";
import { decodeToken } from "../../../_pipes/functions";
import { iTeam, iTeamMembers } from "diu-component-library";

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
    myControl = new FormControl();
    filteredOptions: Observable<string[]>;
    isAdmin = false;

    constructor(public store: Store, private router: Router, private route: ActivatedRoute) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
        }
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.selectedteamcode = params.get("teamcode") || "";
            this.onCollapse();
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
                map((value) => this.funcFilter(value))
            );
            if (this.selectedteamcode) {
                this.changeTeamWithCode(this.selectedteamcode);
            }
        });
        if (this.tokenDecoded && this.tokenDecoded.memberships) {
            this.tokenDecoded.memberships.forEach((membership) => {
                this.addtoMyTeams(membership.teamcode);
            });
        }
    }

    addtoMyTeams(teamcode: string) {
        const res = this.allTeams.filter((x) => x.code === teamcode);
        if (res.length > 0) this.myTeams.push(res[0]);
    }

    onCollapse() {
        if (this.selectedteamcode !== "") {
            this.openCloseAnim = this.openCloseAnim === "open" ? "close" : "open";
            this.openCloseAnim === "open" ? setTimeout(() => (this.visible = true), 600) : (this.visible = false);
        }
    }

    createTeam() {
        this.router.navigate(["teams", "create-team"]);
    }

    checkAdmin(admins: string[], username: string) {
        this.isAdmin= admins.includes(username) ? true : false;
    }

    changeTeamWithName(teamname: string) {
        this.currentTeam = this.allTeams.filter((x) => x.name === teamname)[0];
        this.reloadComponent();
    }

    changeTeamWithCode(teamcode: string) {
        this.currentTeam = this.allTeams.filter((x) => x.code === teamcode)[0];
        this.reloadComponent();
    }

    reloadComponent() {
        this.checkAdmin(this.currentTeam.responsiblepeople, this.tokenDecoded.username + "#" + this.tokenDecoded.organisation);
        this.router.navigate(["teams", this.currentTeam.code]);
    }

    private funcFilter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTeams.filter((option) => option.name.toLowerCase().includes(filterValue)).map((val) => val.name);
    }

    inTeam(teamname) {
        const currentTeam = this.allTeams.filter((x) => x.name === teamname)[0];
        let blnShow = false;
        if (this.myTeams) {
            this.myTeams.forEach((team) => {
                if (team.code === currentTeam.code) {
                    blnShow = true;
                }
            });
        }
        return blnShow;
    }
}
