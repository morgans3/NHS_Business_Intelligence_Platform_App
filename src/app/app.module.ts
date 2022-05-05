import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CommonModule, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { AppRoutes } from "./app.routing";
import { AppComponent } from "./app.component";
import { FullComponent } from "./layouts/full/full.component";
import { FormLayoutComponent } from "./layouts/form/form.component";
import { SupportLayoutComponent } from "./layouts/support/support.component";
import { SupportLayoutSidebarComponent } from "./layouts/support/sidebar/status-sidebar.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AccordionLinkModule } from "./shared/accordion/accordionLinkModule";
import { SpinnerComponent } from "./shared/spinner.component";
import { DiuAngularNavigationModule, DiuHeaderModule, MaterialModule } from "diu-component-library";
import { ToastrModule } from "ngx-toastr";
import { AuthGuard } from "./_guards/auth.guard";
import { RequestInterceptor } from "./_services/requestinterceptor.service";
import { NgxsModule } from "@ngxs/store";
import { NgxsResetPluginModule } from "ngxs-reset-plugin";
import { AlertState } from "./_states/alert.state";
import { AuthState } from "./_states/auth.state";
import { ReferenceState } from "./_states/reference.state";
import { NgxsStoragePluginModule, StorageOption } from "@ngxs/storage-plugin";
import { NgxsEmitPluginModule } from "@ngxs-labs/emitter";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { MatDatetimepickerModule } from "@mat-datetimepicker/core";
import { MatDatepickerModule } from "@angular/material/datepicker/";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { NgxTwitterTimelineModule } from "ngx-twitter-timeline";
import { SharedModule } from "./shared/shared.module";
import { NotificationService } from "./_services/notification.service";
import { DIUServicesModule } from "diu-component-library";
import { PostcodeService } from "./_services/postcodes.service";
import { StorageService } from "./_services/storage.service";
import { FullmapComponent } from "./layouts/fullmap/fullmap.component";
import { environment } from "src/environments/environment";
import { CwrErrorHandler } from "./cwr-error-handler";

@NgModule({
  declarations: [AppComponent, FullComponent, FullmapComponent, SpinnerComponent, FormLayoutComponent, SupportLayoutComponent, SupportLayoutSidebarComponent],
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
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: "toast-bottom-full-width",
      preventDuplicates: true,
    }),
    SharedModule,
    NgxsModule.forRoot([AuthState, AlertState, ReferenceState], {
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    PostcodeService,
    StorageService,
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
