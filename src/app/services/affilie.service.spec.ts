import { TestBed } from '@angular/core/testing';

import { AffilieService } from './affilie.service';

describe('AffilieService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AffilieService = TestBed.inject(AffilieService);
    expect(service).toBeTruthy();
  });
});
