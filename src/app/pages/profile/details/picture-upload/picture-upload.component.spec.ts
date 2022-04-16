/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { DiuComponentLibraryModule } from "diu-component-library";
import { ProfilePictureUploadComponent } from "./picture-upload.component";

describe("ProfilePictureUploadComponent", () => {
  let component: ProfilePictureUploadComponent;
  let fixture: ComponentFixture<ProfilePictureUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DemoMaterialModule, FlexLayoutModule, DiuComponentLibraryModule],
      declarations: [ProfilePictureUploadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePictureUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
