/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RolecapabilitylistComponent } from './rolecapabilitylist.component';

describe('RolecapabilitylistComponent', () => {
  let component: RolecapabilitylistComponent;
  let fixture: ComponentFixture<RolecapabilitylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolecapabilitylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolecapabilitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
