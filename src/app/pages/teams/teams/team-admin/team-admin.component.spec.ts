/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { DiuComponentLibraryModule } from "diu-component-library";
import { NotificationService } from "src/app/_services/notification.service";
import { TeamAdminComponent } from "./team-admin.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { AuthState } from "src/app/_states/auth.state";
import { APIService } from "diu-component-library";

describe("TeamAdminComponent", () => {
    let component: TeamAdminComponent;
    let fixture: ComponentFixture<TeamAdminComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                DemoMaterialModule,
                FlexLayoutModule,
                DiuComponentLibraryModule,
                HttpClientModule,
                NgxsModule.forRoot([AuthState]),
                ToastrModule.forRoot(),
                BrowserAnimationsModule,
            ],
            providers: [APIService, NotificationService, ToastrService],
            declarations: [TeamAdminComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TeamAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
