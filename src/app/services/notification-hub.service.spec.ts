import { TestBed } from '@angular/core/testing';

import { NotificationHubService } from './notification-hub.service';

describe('NotificationHubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationHubService = TestBed.inject(NotificationHubService);
    expect(service).toBeTruthy();
  });
});
