import { DecimalPipe } from '@angular/common';
import { AmountPipe } from './amount.pipe';

describe('AmountPipe', () => {
  it('create an instance', () => {
    const decimalPipe = new DecimalPipe('en-US'); // Provide the appropriate locale for the DecimalPipe
    const pipe = new AmountPipe(decimalPipe); // Provide an instance of DecimalPipe
    expect(pipe).toBeTruthy();
  });
});
