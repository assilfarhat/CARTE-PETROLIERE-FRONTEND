import { TestBed } from '@angular/core/testing';

import { NoteDebitCreditService } from './note-debit-credit.service';

describe('NoteDebitCreditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoteDebitCreditService = TestBed.inject(NoteDebitCreditService);
    expect(service).toBeTruthy();
  });
});
