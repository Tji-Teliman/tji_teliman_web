import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Litiges } from './litiges';

describe('Litiges', () => {
  let component: Litiges;
  let fixture: ComponentFixture<Litiges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Litiges]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Litiges);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
