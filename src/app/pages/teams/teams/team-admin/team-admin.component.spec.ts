/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { DiuComponentLibraryModule } from "diu-component-library";
import { NotificationService } from "src/app/_services/notification.service";
import { DynAPIService } from "src/app/_services/dynapi.service";
import { TeamAdminComponent } from "./team-admin.component";
import { TasksService } from "src/app/_services/tasks.service";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { AuthState } from "src/app/_states/auth.state";

describe("TeamAdminComponent", () => {
  let component: TeamAdminComponent;
  let fixture: ComponentFixture<TeamAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DemoMaterialModule, FlexLayoutModule, DiuComponentLibraryModule, HttpClientModule, NgxsModule.forRoot([AuthState]), ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [NotificationService, DynAPIService, TasksService, ToastrService],
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
