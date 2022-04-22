/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { TeamsComponent } from "./teams.component";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { APIService } from "diu-component-library";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { NgxsModule } from "@ngxs/store";
import { AuthState } from "src/app/_states/auth.state";
import { ReferenceState } from "src/app/_states/reference.state";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("TeamsComponent", () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DemoMaterialModule, FlexLayoutModule, CommonModule, RouterTestingModule, HttpClientModule, NgxsModule.forRoot([AuthState, ReferenceState]), BrowserAnimationsModule],
      providers: [APIService],
      declarations: [TeamsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
