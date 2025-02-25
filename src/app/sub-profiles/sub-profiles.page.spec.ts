import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubProfilesPage } from './sub-profiles.page';

describe('SubProfilesPage', () => {
  let component: SubProfilesPage;
  let fixture: ComponentFixture<SubProfilesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubProfilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
