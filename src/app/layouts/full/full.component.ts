import { MediaMatcher } from "@angular/cdk/layout";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { MENUITEMS } from "../../shared/menu-items/menu-items";
import { Title } from "@angular/platform-browser";
import { APIService, iSystemAlerts } from "diu-component-library";
import { iMenu } from "diu-component-library/lib/_models/menu-items.interface";
import { Store } from "@ngxs/store";
import { AuthState, ManualSetAuthTokens } from "src/app/_states/auth.state";
import { AlertState, AlertStateModel, UpdateAlerts } from "src/app/_states/alert.state";
import { NotificationService } from "src/app/_services/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { decodeToken } from "src/app/_pipes/functions";

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
})
export class FullComponent implements OnDestroy, OnInit {
    user: any;
    userToken: any;
    sidebarOpened = true;
    mobileQuery: MediaQueryList;
    isIE = /msie\s|trident\//i.test(window.navigator.userAgent);
    myAlerts: iSystemAlerts[] = [];
    config: iAppConfig = {
        name: environment.appName,
        landingpage: environment.homepage,
        menuitems: MENUITEMS,
    };
    minisidebar = false;

    constructor(
        public store: Store,
        private titleService: Title,
        private apiService: APIService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher
    ) {
        // Check for mobile device
        this.mobileQuery = media.matchMedia("(min-width: 768px)");
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);

        // Get user details
        this.userToken = this.store.selectSnapshot(AuthState.getToken);
        if (this.userToken) {
            this.user = decodeToken(this.userToken);
            this.store.dispatch(new UpdateAlerts());
        }

        // Initialise config
        this.activatedRoute.data.subscribe((data) => {
            this.getConfiguration(data?.layout_config?.id || "Nexus_Intelligence");
        });
    }

    private mobileQueryListener: () => void;

    ngOnInit() {
        this.store.select(AlertState.getAlerts).subscribe((state: AlertStateModel) => {
            if (state.myAlerts && state.myAlerts.length > 0) {
                this.myAlerts = state.myAlerts;
            }
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

    getConfiguration(id) {
        // Load basic landing page
        localStorage.removeItem("@AppConfig");

        // Call in App Settings and MenuItems
        this.apiService.getPayloadById(id).subscribe((payload: any) => {
            if (payload) {
                // Get & set new config
                const appConfig = JSON.parse(payload?.config);
                localStorage.setItem("@AppConfig", JSON.stringify(appConfig));

                // Get user capability array
                const userCapabilities = this.user.capabilities.map((item) => Object.keys(item)[0]);

                // Set new config
                this.config = {
                    name: appConfig.name,
                    landingpage: appConfig.landingpage,
                    menuitems: appConfig.menuitems.filter((menu: iMenu) => {
                        if (menu.role) {
                            // Check for role
                            const userHasRole = this.user && userCapabilities && userCapabilities.includes(menu.role);

                            // Return
                            return userHasRole ? true : false;
                        } else {
                            return true;
                        }
                    }),
                };

                // Set page title
                this.titleService.setTitle(appConfig.name);

                // Navigate to App Landing page
                this.router.navigate([appConfig.landingpage]);
            }
        });
    }

    toggleSidebar() {
        this.minisidebar = !this.minisidebar;
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 400);
    }

    logout() {
        this.apiService.logout("www." + environment.websiteURL);
    }

    showErrors(event: any) {
        if (event) {
            this.notificationService.warning(event.toString());
        }
    }

    updateToken(newToken: any) {
        if (newToken) {
            this.userToken = newToken;
            this.user = decodeToken(newToken);
            this.store.dispatch(
                new ManualSetAuthTokens({
                    success: true,
                    token: newToken,
                })
            );
        }
    }
}
