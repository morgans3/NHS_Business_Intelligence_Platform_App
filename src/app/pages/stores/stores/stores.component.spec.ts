/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { StoresComponent } from "./stores.component";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { DiuComponentLibraryModule } from "diu-component-library";
import { RouterTestingModule } from "@angular/router/testing";

describe("StoresComponent", () => {
  let component: StoresComponent;
  let fixture: ComponentFixture<StoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DemoMaterialModule, FlexLayoutModule, DiuComponentLibraryModule, RouterTestingModule],
      declarations: [StoresComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
