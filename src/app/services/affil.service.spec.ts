import { TestBed } from '@angular/core/testing';

import { AffilService } from './affil.service';

describe('AffilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AffilService = TestBed.inject(AffilService);
    expect(service).toBeTruthy();
  });
});
