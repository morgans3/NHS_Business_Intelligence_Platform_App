/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IncidentLegendComponent } from "./incidentLegend.component";

describe("IncidentLegendComponent", () => {
    let component: IncidentLegendComponent;
    let fixture: ComponentFixture<IncidentLegendComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule],
            providers: [],
            declarations: [IncidentLegendComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IncidentLegendComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
