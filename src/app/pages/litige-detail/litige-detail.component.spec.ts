import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitigesDetailComponent } from './litige-detail.component';

describe('LitigeDetailComponent', () => {
  let component: LitigesDetailComponent;
  let fixture: ComponentFixture<LitigesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LitigesDetailComponent]
    });
    fixture = TestBed.createComponent(LitigesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
