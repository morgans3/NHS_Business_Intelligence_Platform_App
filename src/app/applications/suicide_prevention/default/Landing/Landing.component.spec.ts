/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { NgxsModule } from "@ngxs/store";
import { MaterialModule } from "../../material/material.module";
import { MapComponent } from "../../_components/map.component";
import { ReferenceService } from "../../_services/reference.service";
import { StorageService } from "../../_services/storage.service";
import { AuthState } from "../../_states/auth.state";
import { IncidentLegendComponent } from "./incidentLegend/incidentLegend.component";
import { LandingComponent } from "./Landing.component";
import "hammerjs";
import { StatCardComponent } from "../../_components/stat-card.component";

describe("LandingComponent", () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule, FormsModule, NgxsModule.forRoot([AuthState]), HttpClientModule, LeafletModule.forRoot(), LeafletDrawModule.forRoot()],
      providers: [StorageService, ReferenceService],
      declarations: [MapComponent, LandingComponent, IncidentLegendComponent, StatCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
