/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APIService } from "diu-component-library";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { NotificationService } from "src/app/_services/notification.service";
import { PostcodeService } from "src/app/_services/postcodes.service";
import { FindMosaicComponent } from "./findMosaic.component";

describe("FindMosaicComponent", () => {
  let component: FindMosaicComponent;
  let fixture: ComponentFixture<FindMosaicComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, DemoMaterialModule, ToastrModule.forRoot(), HttpClientModule],
      providers: [APIService, PostcodeService, ToastrService, NotificationService],
      declarations: [FindMosaicComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMosaicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
