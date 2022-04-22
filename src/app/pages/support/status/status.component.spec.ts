/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DemoMaterialModule } from "src/app/demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { APIService } from "diu-component-library";
import { StatusComponent } from "./status.component";
import { NotificationService } from "src/app/_services/notification.service";
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
      providers: [APIService, ToastrService, NotificationService],
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
