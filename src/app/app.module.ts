import { ErrorHandler, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CommonModule, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutes } from "./app.routing";
import { AppComponent } from "./app.component";

// Layouts
import { FullComponent } from "./layouts/full/full.component";
import { FormLayoutComponent } from "./layouts/form/form.component";
import { SupportLayoutComponent } from "./layouts/support/support.component";
import { SupportLayoutSidebarComponent } from "./layouts/support/sidebar/status-sidebar.component";
import { FullmapComponent } from "./layouts/fullmap/fullmap.component";

// Libraries
import { NgxsModule } from "@ngxs/store";
import { NgxsResetPluginModule } from "ngxs-reset-plugin";
import { NgxsStoragePluginModule, StorageOption } from "@ngxs/storage-plugin";
import { NgxsEmitPluginModule } from "@ngxs-labs/emitter";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { DiuAngularNavigationModule, DiuHeaderModule, MaterialModule, DIUServicesModule } from "diu-component-library";
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { MatDatepickerModule } from "@angular/material/datepicker/";
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { NgxTwitterTimelineModule } from "ngx-twitter-timeline";

// Route guards
import { AuthGuard } from "./_guards/auth.guard";
import { PidGuard } from "./_guards/pid.guard";
import { CapabilityGuard } from "./_guards/capability.guard";

// Other
import { AccordionLinkModule } from "./shared/accordion/accordionLinkModule";
import { SpinnerComponent } from "./shared/spinner.component";
import { AlertState } from "./_states/alert.state";
import { AuthState } from "./_states/auth.state";
import { DynamicConfigState } from "./_states/dynamic-config.state";
import { ReferenceState } from "./_states/reference.state";
import { SharedModule } from "./shared/shared.module";
import { NotificationService } from "./_services/notification.service";
import { PostcodeService } from "./_services/postcodes.service";
import { RequestInterceptor } from "./_services/requestinterceptor.service";
import { environment } from "src/environments/environment";
import { CwrErrorHandler } from "./cwr-error-handler";
import { DemoMaterialModule } from "./demo-material-module";

@NgModule({
    declarations: [
        AppComponent,
        FullComponent,
        FullmapComponent,
        SpinnerComponent,
        FormLayoutComponent,
        SupportLayoutComponent,
        SupportLayoutSidebarComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        HttpClientModule,
        AccordionLinkModule,
        RouterModule.forRoot(AppRoutes),
        DiuAngularNavigationModule,
        DiuHeaderModule,
        SharedModule,
        NgxsModule.forRoot([AuthState, AlertState, DynamicConfigState, ReferenceState], {
            developmentMode: !true,
        }),
        NgxsStoragePluginModule.forRoot({
            storage: StorageOption.LocalStorage,
        }),
        NgxsResetPluginModule.forRoot(),
        NgxsEmitPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: true,
        }),
        NgxsLoggerPluginModule.forRoot({
            disabled: true,
        }),
        MaterialModule,
        DemoMaterialModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatDatetimepickerModule,
        NgxTwitterTimelineModule,
        DIUServicesModule,
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
        AuthGuard,
        PidGuard,
        CapabilityGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptor,
            multi: true,
        },
        { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        PostcodeService,
        DIUServicesModule,
        { provide: "environment", useValue: environment },
        NotificationService,
        {
            provide: ErrorHandler,
            useClass: CwrErrorHandler,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
