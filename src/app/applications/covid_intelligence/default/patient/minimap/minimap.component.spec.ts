/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MinimapComponent } from './minimap.component';

describe('MinimapComponent', () => {
  let component: MinimapComponent;
  let fixture: ComponentFixture<MinimapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
