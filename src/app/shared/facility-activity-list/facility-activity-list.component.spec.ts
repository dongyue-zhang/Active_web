import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityActivityListComponent } from './facility-activity-list.component';

describe('FacilityActivityListComponent', () => {
  let component: FacilityActivityListComponent;
  let fixture: ComponentFixture<FacilityActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityActivityListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacilityActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
