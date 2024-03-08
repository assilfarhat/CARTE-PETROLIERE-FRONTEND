import { TestBed } from '@angular/core/testing';

import { ProduitsService } from './produits.service';

describe('ProduitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProduitsService = TestBed.inject(ProduitsService);
    expect(service).toBeTruthy();
  });
});
