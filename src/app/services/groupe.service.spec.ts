import { TestBed } from '@angular/core/testing';

import { GroupeService } from './groupe.service';

describe('GroupeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupeService = TestBed.inject(GroupeService);
    expect(service).toBeTruthy();
  });
});
