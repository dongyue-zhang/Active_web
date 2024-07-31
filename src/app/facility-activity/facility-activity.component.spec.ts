import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityActivityComponent } from './facility-activity.component';

describe('FacilityActivityComponent', () => {
  let component: FacilityActivityComponent;
  let fixture: ComponentFixture<FacilityActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacilityActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
