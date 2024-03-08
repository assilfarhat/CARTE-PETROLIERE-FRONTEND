import { TestBed } from '@angular/core/testing';

import { JourferieService } from './jourferie.service';

describe('JourferieService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JourferieService = TestBed.inject(JourferieService);
    expect(service).toBeTruthy();
  });
});
