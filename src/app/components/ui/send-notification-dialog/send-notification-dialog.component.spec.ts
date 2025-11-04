import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNotificationDialogComponent } from './send-notification-dialog.component';

describe('SendNotificationDialogComponent', () => {
  let component: SendNotificationDialogComponent;
  let fixture: ComponentFixture<SendNotificationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SendNotificationDialogComponent]
    });
    fixture = TestBed.createComponent(SendNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
