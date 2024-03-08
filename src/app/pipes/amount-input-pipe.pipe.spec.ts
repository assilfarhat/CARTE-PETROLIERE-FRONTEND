import { DecimalPipe } from '@angular/common';
import { AmountInputPipe } from './amount-input-pipe.pipe'; // Ensure the import path is correct

describe('AmountInputPipe', () => {
  it('create an instance', () => {
    const decimalPipe = new DecimalPipe('en-US'); // Provide the appropriate locale for DecimalPipe
    const pipe = new AmountInputPipe(decimalPipe); // Pass the DecimalPipe instance as an argument
    expect(pipe).toBeTruthy();
  });
});
