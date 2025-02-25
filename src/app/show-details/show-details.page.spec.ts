import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowDetailsPage } from './show-details.page';

describe('ShowDetailsPage', () => {
  let component: ShowDetailsPage;
  let fixture: ComponentFixture<ShowDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
