/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { NgxsModule } from "@ngxs/store";
import { IncidentLegendComponent } from "./incidentLegend/incidentLegend.component";
import { LandingComponent } from "./Landing.component";
import "hammerjs";
import { AuthState } from "src/app/_states/auth.state";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { StorageService } from "src/app/_services/storage.service";
import { APIService } from "diu-component-library";
import { StatCardComponent } from "../_components/stat-card.component";
import { MapComponent } from "../_components/map.component";

describe("LandingComponent", () => {
    let component: LandingComponent;
    let fixture: ComponentFixture<LandingComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                DemoMaterialModule,
                FormsModule,
                NgxsModule.forRoot([AuthState]),
                HttpClientModule,
                LeafletModule,
                LeafletDrawModule,
            ],
            providers: [StorageService, APIService],
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
