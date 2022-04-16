/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { DemoMaterialModule } from "src/app/demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { UserGroupService } from "diu-component-library";
import { StatusComponent } from "./status.component";
import { MessagingService } from "src/app/_services/messaging.service";
import { AuthService } from "src/app/_services/auth.service";
import { NotificationService } from "src/app/_services/notification.service";
import { TasksService } from "src/app/_services/tasks.service";
import { DynAPIService } from "src/app/_services/dynapi.service";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { AuthState } from "src/app/_states/auth.state";
import { NgxsModule } from "@ngxs/store";

describe("StatusComponent", () => {
    let component: StatusComponent;
    let fixture: ComponentFixture<StatusComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [DemoMaterialModule, FlexLayoutModule, CommonModule, HttpClientModule, ToastrModule.forRoot(), NgxsModule.forRoot([AuthState])],
            providers: [UserGroupService, MessagingService, AuthService, NotificationService, TasksService, DynAPIService, ToastrService],
            declarations: [StatusComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
