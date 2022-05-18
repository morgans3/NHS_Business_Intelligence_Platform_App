/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { MapfiltersComponent } from "./mapfilters.component";

describe("MapfiltersComponent", () => {
    let component: MapfiltersComponent;
    let fixture: ComponentFixture<MapfiltersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MapfiltersComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapfiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
