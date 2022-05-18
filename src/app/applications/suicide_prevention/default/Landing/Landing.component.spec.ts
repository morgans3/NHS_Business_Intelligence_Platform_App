/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { MapComponent } from "../../_components/map.component";
import { IncidentLegendComponent } from "./incidentLegend/incidentLegend.component";
import { LandingComponent } from "./Landing.component";
import "hammerjs";
import { StatCardComponent } from "../../_components/stat-card.component";

describe("LandingComponent", () => {
    let component: LandingComponent;
    let fixture: ComponentFixture<LandingComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, FormsModule, HttpClientModule, LeafletModule, LeafletDrawModule],
            providers: [],
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
