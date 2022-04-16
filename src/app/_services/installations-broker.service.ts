import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { DynamicApiService, iApplication, iDisplayList, iInstallation, iTeamMembers } from "diu-component-library";
import { decodeToken, generateID } from "../_pipes/functions";
import { AuthState } from "../_states/auth.state";

export interface iInstallationArray {
  arrType: string;
  teamcode?: string;
  installations: iInstallation[];
}

@Injectable({
  providedIn: "root",
})
export class InstallationsBrokerService {
  loggedinUser: string;
  private allApplications: iApplication[] = [];
  private allDashboards: iApplication[] = [];

  private allMyInstallations: iInstallationArray[] = [];
  private allTeamInstallations: iInstallationArray[] = [];

  constructor(private dynapiService: DynamicApiService, public store: Store) {}

  buildUserData() {
    if (!this.loggedinUser) {
      this.populateApps();
      const token = this.store.selectSnapshot(AuthState.getToken) || "";
      if (token.length > 0) {
        this.populateLoggedInUserData(decodeToken(token));
      }
    }
  }

  populateApps() {
    this.dynapiService.getApps().subscribe((res: any) => {
      this.allApplications = res;
    });
    this.dynapiService.getDashboards().subscribe((res: any) => {
      this.allDashboards = res;
    });
  }

  populateLoggedInUserData(decodedToken: any) {
    if (decodedToken && decodedToken.username) {
      this.loggedinUser = decodedToken.username;
      this.dynapiService.getInstallationsByUsername(decodedToken.username).subscribe((res: any) => {
        this.allMyInstallations.push({
          arrType: "apps",
          installations: res || [],
        });
        this.dynapiService.getDashboardInstallsByUsername(decodedToken.username).subscribe((response: any) => {
          this.allMyInstallations.push({
            arrType: "dashboards",
            installations: response || [],
          });
        });
      });

      if (decodedToken.memberships && decodedToken.memberships.length > 0) {
        decodedToken.memberships.forEach((team: iTeamMembers) => {
          this.dynapiService.getInstallationsByTeamCode(team.teamcode).subscribe((res: any) => {
            this.allTeamInstallations.push({
              arrType: "apps",
              teamcode: team.teamcode,
              installations: res || [],
            });
            this.dynapiService.getDashboardInstallsByUsername(team.teamcode).subscribe((response: any) => {
              this.allTeamInstallations.push({
                arrType: "dashboards",
                teamcode: team.teamcode,
                installations: response || [],
              });
            });
          });
        });
      }
    }
  }

  getApplications() {
    return this.allApplications;
  }

  getDashboards() {
    return this.allDashboards;
  }

  getMyInstallations(type: string = "apps") {
    let output: iInstallation[] = [];
    const arrs = this.allMyInstallations.filter((x) => x.arrType === type);
    arrs.forEach((arr) => {
      output = output.concat(arr.installations);
    });
    return output;
  }

  getAllInstallations() {
    let output: iInstallation[] = [];
    const arrs = this.allMyInstallations.concat(this.allTeamInstallations);
    arrs.forEach((arr) => {
      output = output.concat(arr.installations);
    });
    return output;
  }

  getTeamInstallations(teamcode: string) {
    let output: iInstallation[] = [];
    const teamarray = this.allTeamInstallations.filter((x) => x.arrType === teamcode);
    if (teamarray) {
      teamarray.forEach((arr) => {
        output = output.concat(arr.installations);
      });
    }
    return output;
  }

  getAllTeamInstallations(teamcode: string, callback: any) {
    let output: any[] = [];
    this.dynapiService.getInstallationsByTeamCode(teamcode).subscribe((res: any) => {
      output = res || [];
      this.dynapiService.getDashboardInstallsByUsername(teamcode).subscribe((response: any) => {
        output.concat(response || []);
        callback(null, output);
      });
    });
  }

  addInstallation(appname: string, type: string, callback: any, username?: string, teamcode?: string) {
    const dashboard = this.allDashboards.find((x) => x.name === appname);
    const application = this.allApplications.find((x) => x.name === appname);
    const app = application || dashboard;
    this.installApp(app!, this.loggedinUser, callback, type, username, teamcode);
  }

  private installApp(app: iApplication, author: string, callback: any, type: string, username?: string, teamcode?: string) {
    const newId = generateID();
    const newInstall: iInstallation = {
      app_name: app.name,
      _id: newId,
      requestdate: new Date(),
      requestor: author,
      requestapprover: author,
      approveddate: new Date(),
    };
    if (username) {
      newInstall.username = username;
    } else if (teamcode) {
      newInstall.teamcode = teamcode;
    } else {
      callback("No team or person selected.", null);
      return;
    }
    this.dynapiService.addInstallationByType(type, newInstall).subscribe((res: any) => {
      if (res.err) {
        callback("Unable to add application, reason:" + res.err, null);
      } else {
        if (username && author === username) {
          try {
            const arr = this.allMyInstallations.find((x) => x.arrType === type.toLowerCase());
            if (arr) arr.installations.push(newInstall);
          } catch {}
        } else if (teamcode) {
          try {
            this.allTeamInstallations.find((x) => x.arrType === type && x.teamcode === teamcode)!.installations.push(newInstall);
          } catch {}
        }
        callback(null, newInstall);
      }
    });
  }

  removeInstallationFromAList(install: iInstallation, callback: any, list?: iInstallation[]) {
    let foundInstall: any = this.allMyInstallations.find((x) => x.installations.filter((y) => y._id === install._id).length > 0);
    if (!foundInstall) {
      foundInstall = this.allTeamInstallations.find((x) => x.installations.filter((y) => y._id === install._id).length > 0);
    }

    if (list) {
      foundInstall = list.find((x: any) => (y: any) => y._id === install._id);
    }

    if (foundInstall === undefined) {
      callback("installation not found", false);
      return;
    } else {
      this.dynapiService.archiveInstallation(install).subscribe((res: any) => {
        if (res.success) {
          foundInstall = this.removeInstall(install, list || foundInstall);
          callback(null, foundInstall);
        } else {
          callback(res.msg, false);
        }
      });
    }
  }

  private removeInstall(install: iInstallation, arr: any) {
    if (arr.installations) {
      arr.installations.splice(arr.installations.indexOf(install), 1);
    } else {
      arr.splice(arr.indexOf(install), 1);
    }
    return arr;
  }

  createDisplayLists(profile: string = "user", callback: any, teamcode?: string) {
    let appList: iDisplayList[] = [],
      dashboardlist: iDisplayList[] = [];
    if (profile === "user") {
      this.allApplications.forEach((app) => {
        let status = "";
        this.getMyInstallations("apps").find((y) => y.app_name === app.name) ? (status = "Installed") : (status = "");
        appList.push({ name: app.name, status: status });
      });
      this.allDashboards.forEach((app) => {
        let status = "";
        this.getMyInstallations("dashboards").find((y) => y.app_name === app.name) ? (status = "Installed") : (status = "");
        dashboardlist.push({ name: app.name, status: status });
      });
      callback(null, [
        { title: "Apps", data: appList },
        { title: "Dashboards", data: dashboardlist },
      ]);
    } else if (profile === "team") {
      this.getAllTeamInstallations(teamcode!, (err: any, res: iInstallation[]) => {
        this.allApplications.forEach((app) => {
          let status = "";
          res.find((y) => y.app_name === app.name && y.teamcode === teamcode) ? (status = "Installed") : (status = "");
          appList.push({ name: app.name, status: status });
        });
        this.allDashboards.forEach((app) => {
          let status = "";
          res.find((y) => y.app_name === app.name && y.teamcode === teamcode) ? (status = "Installed") : (status = "");
          dashboardlist.push({ name: app.name, status: status });
        });
        callback(null, [
          { title: "Apps", data: appList },
          { title: "Dashboards", data: dashboardlist },
        ]);
      });
    } else {
      this.allApplications.forEach((app) => {
        let status = "";
        this.getAllInstallations().find((y) => y.app_name === app.name) ? (status = "Installed") : (status = "");
        appList.push({ name: app.name, status: status });
      });
      this.allDashboards.forEach((app) => {
        let status = "";
        this.getAllInstallations().find((y) => y.app_name === app.name) ? (status = "Installed") : (status = "");
        dashboardlist.push({ name: app.name, status: status });
      });
      callback(null, [
        { title: "Apps", data: appList },
        { title: "Dashboards", data: dashboardlist },
      ]);
    }
  }
}
