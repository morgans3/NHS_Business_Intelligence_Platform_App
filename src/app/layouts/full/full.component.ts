import { MediaMatcher } from "@angular/cdk/layout";
import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { MENUITEMS } from "../../shared/menu-items/menu-items";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Title } from "@angular/platform-browser";
import { DynamicApiService, iSystemAlerts, MFAAuthService } from "diu-component-library";
import { iMenu } from "diu-component-library/lib/_models/menu-items.interface";
import { Store } from "@ngxs/store";
import { AuthState, ManualSetAuthTokens } from "src/app/_states/auth.state";
import jwt_decode from "jwt-decode";
import { AlertState, AlertStateModel, UpdateAlerts } from "src/app/_states/alert.state";
import { NotificationService } from "src/app/_services/notification.service";
import { Router } from "@angular/router";

export interface iAppConfig {
  name: string;
  landingpage: string;
  menuitems: iMenu[];
}

export interface iPageConfig {
  id: string;
  type: string;
  config: any;
  children: any[];
}

/** @title Responsive sidenav */
@Component({
  selector: "app-full-layout",
  templateUrl: "full.component.html",
  styleUrls: [],
})
export class FullComponent implements OnDestroy, AfterViewInit, OnInit {
  mobileQuery: MediaQueryList;
  isIE = /msie\s|trident\//i.test(window.navigator.userAgent);
  appName = environment.appName;
  home = environment.homepage;
  faExclamation = faExclamationCircle;
  minisidebar: boolean = false;
  username: string = "";
  myAlerts: iSystemAlerts[] = [];
  tokenDecoded: any;
  shownMenuItems: iMenu[] = [];
  jwtToken: any;
  sidebarOpened = true;

  private _mobileQueryListener: () => void;

  constructor(private dynapiService: DynamicApiService, private router: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private titleService: Title, public store: Store, private authService: MFAAuthService, private notificationService: NotificationService) {
    this.mobileQuery = media.matchMedia("(min-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.jwtToken = this.store.selectSnapshot(AuthState.getToken);
    if (this.jwtToken) {
      this.tokenDecoded = jwt_decode(this.jwtToken);
      this.username = this.tokenDecoded.username;
      this.store.dispatch(new UpdateAlerts());
    }
    this.constructApp();
  }

  ngOnInit() {
    this.titleService.setTitle(this.appName);
    this.store.select(AlertState.getAlerts).subscribe((state: AlertStateModel) => {
      if (state.myAlerts && state.myAlerts.length > 0) {
        this.myAlerts = state.myAlerts;
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit() {}

  toggleSidebar(event: any) {
    this.minisidebar = !this.minisidebar;
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 400);
  }

  logout(event: any) {
    this.authService.logout();
  }

  showErrors(event: any) {
    if (event) {
      this.notificationService.warning(event.toString());
    }
  }

  updateToken(newToken: any) {
    if (newToken) {
      this.jwtToken = newToken;
      this.tokenDecoded = jwt_decode(this.jwtToken);
      this.store.dispatch(
        new ManualSetAuthTokens({
          success: true,
          token: newToken,
        })
      );
    }
  }

  constructApp() {
    // Load basic landing page
    this.shownMenuItems = MENUITEMS;
    localStorage.removeItem("@AppConfig");
    // Call in App Settings and MenuItems
    this.dynapiService.getPayloadById("Nexus_Intelligence").subscribe((data: any) => {
      if (data && data.length > 0) {
        const thisApp = data[0];
        this.loadAppConfiguration(JSON.parse(thisApp.config));
      }
    });
  }

  loadAppConfiguration(appconfig: iAppConfig) {
    this.appName = appconfig.name;
    this.home = appconfig.landingpage;
    this.shownMenuItems = [];
    appconfig.menuitems.forEach((menu: iMenu) => {
      if (menu.role) {
        if (this.checkRole(menu.role)) this.shownMenuItems.push(menu);
      } else {
        this.shownMenuItems.push(menu);
      }
    });
    localStorage.setItem("@AppConfig", JSON.stringify(appconfig));
    //this.router.navigate(["/" + this.home]);
  }

  checkRole(role: any) {
    if (!role) return true;
    const tokenDecoded = this.tokenDecoded;
    if (tokenDecoded && tokenDecoded.roles && tokenDecoded.roles.filter((x: any) => x[role] && x[role] !== "deny").length > 0) {
      return true;
    }
    return false;
  }
}
