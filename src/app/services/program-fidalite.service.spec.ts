import { TestBed } from '@angular/core/testing';

import { ProgramFidaliteService } from './program-fidalite.service';

describe('ProgramFidaliteService', () => {
  let service: ProgramFidaliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramFidaliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
