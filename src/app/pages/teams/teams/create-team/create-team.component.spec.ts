/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DemoMaterialModule } from "src/app/demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { APIService } from "diu-component-library";
import { CreateTeamComponent } from "./create-team.component";
import { NotificationService } from "src/app/_services/notification.service";
import { NgxsModule } from "@ngxs/store";
import { ReferenceState } from "src/app/_states/reference.state";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("CreateTeamComponent", () => {
  let component: CreateTeamComponent;
  let fixture: ComponentFixture<CreateTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DemoMaterialModule, FlexLayoutModule, CommonModule, HttpClientModule, NgxsModule.forRoot([ReferenceState]), ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [APIService, NotificationService, ToastrService],
      declarations: [CreateTeamComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
