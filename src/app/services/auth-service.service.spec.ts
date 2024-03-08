import { TestBed } from '@angular/core/testing';

import { AuthServiceService } from './auth-service.service';

describe('AuthServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthServiceService = TestBed.inject(AuthServiceService);
    expect(service).toBeTruthy();
  });
});
