import { TestBed } from '@angular/core/testing';

import { SoldeCarteService } from './solde-carte.service';

describe('SoldeCarteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoldeCarteService = TestBed.inject(SoldeCarteService);
    expect(service).toBeTruthy();
  });
});
