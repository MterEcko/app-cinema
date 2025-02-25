import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDashPage } from './main-dash.page';

describe('MainDashPage', () => {
  let component: MainDashPage;
  let fixture: ComponentFixture<MainDashPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
