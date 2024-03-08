import { TestBed } from '@angular/core/testing';

import { PorteurService } from './porteur.service';

describe('PorteurService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PorteurService = TestBed.inject(PorteurService);
    expect(service).toBeTruthy();
  });
});
