import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function montantRangeValidator(): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors | null => {
     const montantMin = formGroup.get('montantMin');
     const montantMax = formGroup.get('montantMax');
 
     if (!montantMin || !montantMax) {
       return null; // If controls are not yet initialized, return null
     }
 
     if (montantMin.value >= montantMax.value) {
       return { 'montantRange': true }; // Return an error if montantMin is not less than montantMax
     }
 
     return null; // Return null if validation passes
  };
 }
export function CompareAmounts(minAmount: any, maxAmount: any) {
  return (formGroup: FormGroup) => {

    const MinAmount = formGroup.controls[minAmount];
    const MaxAmount = formGroup.controls[maxAmount];


    console.log(MinAmount.value, MaxAmount.value, Number(MinAmount.value), Number(MaxAmount.value), Number(MinAmount.value) > Number(MaxAmount.value))

    if (MinAmount.value == '' || MaxAmount.value == ''|| MaxAmount.value == null|| MinAmount.value == null){
      MinAmount.setErrors(null);

      return
    }
      

    if (
      MinAmount.errors && !MinAmount.errors.CompareAmounts
      && MaxAmount.errors && !MaxAmount.errors.CompareAmounts
    )
    return;

    if (Number(MinAmount.value) > Number(MaxAmount.value)) {
      MinAmount.setErrors({ CompareAmounts: true })
    }
    else 
    MinAmount.setErrors(null);


  }
}
export function DateMustBeLaterThanToday(): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors | null => {
     const dateExpirationControl = formGroup.get('dateExpiration');
 
     if (!dateExpirationControl) {
       return null; // If the control is not yet initialized, return null
     }
 
     const today = new Date();
     today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 to compare only the date part
 
     if (dateExpirationControl.value && new Date(dateExpirationControl.value) >= today) {
       return null; // Return null if the date is later than today
     } else {
       return { 'DateMustBeLaterThanToday': true }; // Return an error if the date is not later than today
     }
  };
 }


export function CompareDates(dateDebut: any, dateFin: any) {
  return (formGroup: FormGroup) => {

    const DateDebut = formGroup.controls[dateDebut];
    const DateFin = formGroup.controls[dateFin];


    if (
      DateDebut.errors && !DateDebut.errors.CompareDates
      && DateFin.errors && !DateFin.errors.CompareDates
    )
      return;

    if (new Date(DateDebut.value) > new Date(DateFin.value)) {
      DateDebut.setErrors({ CompareDates: true });
   

    }
    else 
    DateDebut.setErrors(null);
  }
}