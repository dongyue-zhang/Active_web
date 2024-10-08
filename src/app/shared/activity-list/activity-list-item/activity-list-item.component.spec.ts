import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityListItemComponent } from './activity-list-item.component';

describe('ActivityListItemComponent', () => {
  let component: ActivityListItemComponent;
  let fixture: ComponentFixture<ActivityListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
