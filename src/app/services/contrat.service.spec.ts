import { TestBed } from '@angular/core/testing';

import { ContratService } from './contrat.service';

describe('ContratService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContratService = TestBed.inject(ContratService);
    expect(service).toBeTruthy();
  });
});
