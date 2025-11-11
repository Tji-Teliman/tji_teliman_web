import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexLitigeComponent } from './index-litige.component';

describe('IndexLitigeComponent', () => {
  let component: IndexLitigeComponent;
  let fixture: ComponentFixture<IndexLitigeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndexLitigeComponent]
    });
    fixture = TestBed.createComponent(IndexLitigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
