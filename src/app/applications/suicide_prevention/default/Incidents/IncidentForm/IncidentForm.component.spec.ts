/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { FindlocationComponent } from "./findlocation/findlocation.component";
import { FindMosaicComponent } from "./findMosaic/findMosaic.component";
import { IncidentFormComponent } from "./IncidentForm.component";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { APIService } from "diu-component-library";
import { PostcodeService } from "src/app/_services/postcodes.service";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { NotificationService } from "src/app/_services/notification.service";

describe("IncidentFormComponent", () => {
  let component: IncidentFormComponent;
  let fixture: ComponentFixture<IncidentFormComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, DemoMaterialModule, ToastrModule.forRoot(), HttpClientModule, RouterTestingModule, FormsModule, LeafletModule, LeafletDrawModule],
      providers: [APIService, PostcodeService, ToastrService, NotificationService],
      declarations: [IncidentFormComponent, FindlocationComponent, FindMosaicComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
