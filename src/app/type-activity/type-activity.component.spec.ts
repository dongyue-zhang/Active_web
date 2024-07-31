import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeActivityComponent } from './type-activity.component';

describe('TypeActivityComponent', () => {
  let component: TypeActivityComponent;
  let fixture: ComponentFixture<TypeActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
