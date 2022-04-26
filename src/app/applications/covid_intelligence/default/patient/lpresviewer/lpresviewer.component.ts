import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Store } from "@ngxs/store";
import { InterfaceService } from "../../../_services/interface.service";
import { NotificationService } from "../../../_services/notification.service";
import { AuthState } from "../../../_states/auth.state";
import { JwtHelper } from "angular2-jwt";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-lpresviewer",
  templateUrl: "./lpresviewer.component.html",
  styleUrls: ["./lpresviewer.component.scss"],
})
export class LpresviewerComponent implements OnInit {
  @Input() nhsnumber: string;
  endpointRes: string;
  tokenDecoded: any;
  lpresauthendpoint = "https://testing.lpres.co.uk/authentication/";
  username: string = "";
  staffrole: string = "";
  firstname: string = "";
  secondname: string = "";
  hideLPRES = true;

  constructor(private sanitizer: DomSanitizer, private notificationService: NotificationService, private interfaceService: InterfaceService, public store: Store) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelper();
      this.tokenDecoded = jwtHelper.decodeToken(token);
      this.username = this.tokenDecoded.username;
      const namearray = this.tokenDecoded.name.split(" ");
      this.secondname = namearray[1] || "";
      this.firstname = namearray[0];
      this.staffrole = this.selectLPRESRole();
    }
    const parsedUrl = window.location.href;
    this.lpresauthendpoint = this.sortAuthURL(parsedUrl);
  }

  sortAuthURL(origin: string) {
    const domain = origin.split("//")[1].split("/")[0].replace("www", "");
    if (domain.includes("localhost") || domain.includes("dev") || domain.includes("demo")) {
      return "https://testing.lpres.co.uk/authentication/";
    }
    return "https://viewer.lpres.co.uk/authentication/";
  }

  ngOnInit() {
    this.getSSK();
  }

  onSubmit() {
    const theForm: HTMLFormElement = <HTMLFormElement>document.getElementById("theForm");
    this.hideLPRES = false;
    this.notificationService.info("Loading Shared Care Record, this may take a few seconds to display.");
    theForm.submit();
  }

  getSSK() {
    this.interfaceService.getLPRESValidationKey(this.nhsnumber).subscribe((res: any) => {
      if (res.success) {
        this.endpointRes = res.token;
      }
    });
  }

  selectLPRESRole() {
    if (environment.admins.includes(this.tokenDecoded.email)) return "Developer";
    this.tokenDecoded.roles.forEach((roles) => {
      if (roles["lpres_role"]) return roles["lpres_role"];
      if (roles["populationjoined_ccg_code"]) return "Clinical";
    });
    return "Clerical";
  }

  sanitizeURL(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
