/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { APIService } from "diu-component-library";
import { MeetTeamComponent } from "./meet-team.component";
import { NotificationService } from "src/app/_services/notification.service";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthState } from "src/app/_states/auth.state";
import { NgxsModule } from "@ngxs/store";
import { ToastrModule, ToastrService } from "ngx-toastr";

describe("MeetTeamComponent", () => {
    let component: MeetTeamComponent;
    let fixture: ComponentFixture<MeetTeamComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                DemoMaterialModule,
                FlexLayoutModule,
                CommonModule,
                NgxsModule.forRoot([AuthState]),
                HttpClientModule,
                BrowserAnimationsModule,
                ToastrModule.forRoot(),
            ],
            providers: [APIService, NotificationService, ToastrService],
            declarations: [MeetTeamComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MeetTeamComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
