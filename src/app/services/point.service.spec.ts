import { TestBed } from '@angular/core/testing';

import { PointService } from './point.service';

describe('PointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PointService = TestBed.inject(PointService);
    expect(service).toBeTruthy();
  });
});
